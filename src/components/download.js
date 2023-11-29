// src/components/download.js
import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { Context } from '../Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faCircleDown, faFile, faSpinner } from '@fortawesome/free-solid-svg-icons';

// styles
import "../styles/crm_order_list.scss";

const SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

function Download({ prop_btnName, props_array, props_fileName, props_sheetName }) {
    const { user } = useContext(Context);
    const [fileUrl, setFileUrl] = useState('');
    const [isDownloadComplete, setIsDownloadComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    var prop_btnName = prop_btnName || "Save to Drive"
    //const [tokenClient, setTokenClient] = useState({});
    //const array = [["Name", "LastName", "Age"], ["Joa", "Pag", "45"]];

    function disableDownload() {
        return isGoogleSignedIn() && !isProcessing // && hasDataCondition && otherConditions
    }

    const isGoogleSignedIn = () => {
        return user.iss === "Google";
    };

    useEffect(() => {
        console.log("Download User", user)
        console.log("User.Iss", user.iss)
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
                            console.log("POS.JS: Creating the file...");
                            const fileResponse = await axios.post("https://www.googleapis.com/drive/v3/files", {
                                name: props_fileName,
                                mimeType: "application/vnd.google-apps.spreadsheet"
                            }, {
                                headers: {
                                    Authorization: `Bearer ${tokenResponse.access_token}`
                                }
                            });

                            console.log("POS.JS: File response:", fileResponse);
                            resolve({ accessToken: tokenResponse.access_token, fileId: fileResponse.data.id, fileUrl: `https://docs.google.com/spreadsheets/d/${fileResponse.data.id}` });
                        } catch (error) {
                            console.error("POS.JS: Error in creating file ❌:", error);
                            reject(error);
                        }
                    } else {
                        setIsProcessing(false); // ⛔⛔
                        setIsDownloadComplete(true); // ⛔⛔
                        reject('No access token received');
                    }
                }
            });

            initTokenClient.requestAccessToken(); // token request
        });
    };


    const handleCreateFileClick = async () => {
        try {

            let response = await createDriveFile(); // Step 1: Create the file and get its ID
            console.log("POS.JS: CreateDriveFile response: ", response);

            if (response) {
                let fileId = response.fileId;
                let fileUrl = response.fileUrl;
                // console.log("File created, ID:", fileId);
                // console.log("File created, URL:", fileUrl);
                setFileUrl(fileUrl);

                const accessToken = response.accessToken;

                // Step 2: Update the created spreadsheet with the array data
                await updateSpreadsheet(accessToken, fileId, props_array, props_fileName, props_sheetName);
            } else {
                console.error("No response from createDriveFile");
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


    const updateSpreadsheet = async (accessToken, fileId, values, fileName, sheetName) => {
        // Calculate the range based on the values array
        const rows = values.length;
        const qty_columns = values[0].length; // Assuming all rows have the same number of columns
        const endColumnLetter = columnToLetter(qty_columns);
        const range = `A1:${endColumnLetter}${rows}`;
        console.log(range)

        await update_ws_name(accessToken, fileId, sheetName);

        try {
            const response = await axios.put(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${range}`, {
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

            console.log('SS updated:', response.data);
            setIsProcessing(false);
            setIsDownloadComplete(true);
        } catch (error) {
            console.error('SS Error updating:', error);
        }
    };


    // Helper: change WSName
    const update_ws_name = async (accessToken, fileId, sheetName) => {
        try {
            const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            // Sheet[0]
            const sheetId = response.data.sheets[0].properties.sheetId;

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
            console.log('WS name updated to:', sheetName);
        } catch (error) {
            console.error('Error updating WS name:', error);
        }
    };



    return (
        <>
            <button className="btn downloader" onClick={handleCreateFileClick} title="Save to Google Spreadsheet" disabled={!disableDownload()}>
                <FontAwesomeIcon icon={faFileExport} /> {prop_btnName} <FontAwesomeIcon icon={faCircleDown} />
            </button>
            {isDownloadComplete && (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn-fileReady" title={`Open ${props_fileName}`}>
                <FontAwesomeIcon icon={faFile} />
                </a>
            )}
            {isProcessing && (
                <FontAwesomeIcon icon={faSpinner} className="fa-spin"/>
            )}
        </>
    );
}

export default Download;

