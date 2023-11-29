// src/components/download.js
import React, { useState, createContext, useEffect } from "react";
import axios from 'axios'; 
import { Context } from '../Context';
const SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

function Download() {
    const [tokenClient, setTokenClient] = useState({});
    const array = [["Name", "LastName", "Age"], ["Joa", "Pag", "45"]];

    const createDriveFile = async () => {
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
                                name: "ReactApp_Spreadsheet",
                                mimeType: "application/vnd.google-apps.spreadsheet"
                            }, {
                                headers: {
                                    Authorization: `Bearer ${tokenResponse.access_token}`
                                }
                            });
    
                            console.log("POS.JS: File response:", fileResponse);
                            resolve({ fileId: fileResponse.data.id, accessToken: tokenResponse.access_token });
                        } catch (error) {
                            console.error("POS.JS: Error in creating file ❌:", error);
                            reject(error);
                        }
                    } else {
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
                console.log("File created, ID:", fileId);
                const accessToken = response.accessToken; 

                // Step 2: Update the created spreadsheet with the array data
                await updateSpreadsheet(accessToken, fileId, 'A1:C2', array);
            } else {
                console.error("No response from createDriveFile");
            }
        } catch (error) {
            console.error("Error in file creation or updating:", error);
        }
    };
    

    const updateSpreadsheet = async (accessToken, fileId, range, values) => {
        try {
            console.log("ssId: ", fileId);
            let sheetNrange = `sheet1!${range}`
            const response = await axios.put(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${sheetNrange}`, {
                values: values,
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    valueInputOption: 'RAW', // or 'USER_ENTERED'
                },
            });

            console.log('SS updated:', response.data);
        } catch (error) {
            console.error('SS Error updating:', error);
        }
    };

    return (
        <div className='container'>
            <button onClick={handleCreateFileClick}>Download</button>
        </div>
    );
}

export default Download;

