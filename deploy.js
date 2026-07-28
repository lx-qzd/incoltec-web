import * as ftp from "basic-ftp"

async function deploy() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        console.log("Connecting...")
        await client.access({
            host: "web.incoltec.com",
            user: "brightimagelab",
            password: "sj0z8Ujp8VVyExxpKRlY",
            secure: false
        })
        console.log("Connected!")
        // Active mode isn't standard in basic-ftp, but let's try passive first as it often works unless the client firewall blocks it.
        // If the server explicitly requires active, it might fail.
        
        console.log("Listing directory to test connection...")
        console.log(await client.list())
        
        console.log("Uploading files...")
        await client.uploadFrom("../incoltec-web-deploy.zip", "incoltec-web-deploy.zip")
        await client.uploadFrom("unzip.php", "unzip.php")
        console.log("Upload complete!")
    }
    catch(err) {
        console.log("FTP Error: ", err)
    }
    client.close()
}

deploy()
