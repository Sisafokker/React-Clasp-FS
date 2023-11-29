const props_ssPayload = {
    ssName: downloadName,
    data: [
        {
            wsName: "Orders",
            wsValues: ordersForDownload
        },
    ]
}

function eachss () {
    console.log("SSname :",mprops_ssPayload.ssName)
    payload.forEach(sheet=>{
        console.log("sw_ame: ",mprops_ssPayload.data[sheet].wsName)
        console.log("sw_values: ",mprops_ssPayload.data[sheet].wsValues)
    });
}