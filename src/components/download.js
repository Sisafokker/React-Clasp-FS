// src/components/download.js
import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { Context } from '../Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFile, faSpinner } from '@fortawesome/free-solid-svg-icons';

// styles
import "../styles/crm_order_list.scss";

const SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

function Download({ props_ssPayload }) {
    const { user } = useContext(Context);
    const [fileUrl, setFileUrl] = useState('');
    const [isDownloadComplete, setIsDownloadComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const disableDownload = () => {
        return isGoogleSignedIn() && !isProcessing;
    }

    const isGoogleSignedIn = () => {
        return user.iss === "Google";
    };

    useEffect(() => {
        console.log("Download User", user);
    }, []);

    const createDriveFile = async () => {
        setIsProcessing(true);
        return new Promise((resolve, reject) => {
            const initTokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: async (tokenResponse) => {
                    console.log("Token response: ", tokenResponse);
                    if (tokenResponse && tokenResponse.access_token) {
                        try {
                            const fileResponse = await axios.post("https://www.googleapis.com/drive/v3/files", {
                                name: props_ssPayload.ssName,
                                mimeType: "application/vnd.google-apps.spreadsheet"
                            }, {
                                headers: {
                                    Authorization: `Bearer ${tokenResponse.access_token}`
                                }
                            });

                            console.log("File response:", fileResponse);
                            resolve({ accessToken: tokenResponse.access_token, fileId: fileResponse.data.id, fileUrl: `https://docs.google.com/spreadsheets/d/${fileResponse.data.id}` });
                        } catch (error) {
                            console.error("Error in creating file:", error);
                            reject(error);
                        }
                    } else {
                        setIsProcessing(false);
                        setIsDownloadComplete(false);
                        reject('No access token received');
                    }
                }
            });

            initTokenClient.requestAccessToken();
        });
    };

    const handleCreateFileClick = async () => {
        try {
            let response = await createDriveFile();
            if (response) {
                let fileId = response.fileId;
                let fileUrl = response.fileUrl;
                setFileUrl(fileUrl);
                const accessToken = response.accessToken;

                // Add additional WS (if necesarry)
                for (let n = 1; n < props_ssPayload.data.length; n++) { 
                    await addNewSheet(accessToken, fileId, props_ssPayload.data[n].swName);
                }

                // Update each WS with its data
                for (let i = 0; i < props_ssPayload.data.length; i++) { 
                    let data = props_ssPayload.data[i];
                    let sheetNum = i;
                    await updateSpreadsheet(accessToken, fileId, sheetNum, data.values, data.swName);
                }
                setIsProcessing(false);
                setIsDownloadComplete(true);
            }
        } catch (error) {
            console.error("Error in file creation or updating:", error);
        }
    };

    const columnToLetter = (qty_columns) => {
        let temp, colLetter = '', col = qty_columns;
        while (col > 0) {
            temp = (col - 1) % 26;
            colLetter = String.fromCharCode(temp + 65) + colLetter;
            col = (col - temp - 1) / 26;
        }
        return colLetter;
    };

    const updateSpreadsheet = async (accessToken, fileId, sheetNum, values, sheetName) => {
        const rows = values.length;
        const qty_columns = values[0].length;
        const endColumnLetter = columnToLetter(qty_columns);
        const range = `A1:${endColumnLetter}${rows}`;

        if (sheetNum == 0) {
            await update_ws_name(accessToken, fileId, sheetNum, sheetName);
        }
        

        try {
            await axios.put(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${sheetName}!${range}`, {
                values: values,
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    valueInputOption: 'RAW',
                },
            });
        } catch (error) {
            console.error('Error updating spreadsheet:', error);
        }
    };

    const addNewSheet = async (accessToken, fileId, sheetName) => {
        try {
            await axios.post(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}:batchUpdate`, {
                requests: [{
                    addSheet: {
                        properties: {
                            title: sheetName,
                        },
                    },
                }],
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(`New sheet added: ${sheetName}`);
        } catch (error) {
            console.error(`Error adding new sheet (${sheetName}):`, error);
        }
    };

    const update_ws_name = async (accessToken, fileId, sheetNum, sheetName) => {
        try {
            const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const sheetId = response.data.sheets[sheetNum].properties.sheetId;

            await axios.post(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}:batchUpdate`, {
                requests: [{
                    updateSheetProperties: {
                        properties: {
                            sheetId: sheetId,
                            title: sheetName,
                        },
                        fields: 'title',
                    },
                }],
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error updating worksheet name:', error);
        }
    };

    return (
        <>  
            <button className="btn downloader" onClick={handleCreateFileClick} title={props_ssPayload.btnTitle} disabled={!disableDownload()}>
                <FontAwesomeIcon icon={faFileExport} /> { (props_ssPayload && props_ssPayload.btnName) || "Save to Drive" } 
            </button>
                    
            {isDownloadComplete && (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn-fileReady" title={`Open ${props_ssPayload.ssName}`}> <FontAwesomeIcon icon={faFile} /> </a>
            )}

           {isProcessing && (
                <span> <FontAwesomeIcon icon={faSpinner} className="fa-spin"/> </span>
            )}
        </>
    );
}

export default Download;
