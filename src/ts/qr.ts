//d
//  login.ts
//
//  Generated by Poll Castillo on 15/02/2023.
//

import { getUserInfo, _userAgent, getEntityData, updateEntity, updateTokenVisit } from "./endpoints.js"
import { InterfaceElement, Request } from "./types.js"
import { contDown } from "./tools.js"

const loginContainer: InterfaceElement = document.getElementById('login-container')
const app: InterfaceElement = document.getElementById('app')

const connectionHeader = {
    Accept: "application/json",
    "User-agent": _userAgent,
    Authorization: "Basic YzNjMDM1MzQ2MjoyZmM5ZjFiZTVkN2IwZDE4ZjI1YmU2NDJiM2FmMWU1Yg==",
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie: "JSESSIONID=CDD208A868EAABD1F523BB6F3C8946AF",
}


const reqOP: Request = {
    url: 'https://backend.netliinks.com:443/oauth/token',
    method: 'POST'
}

export class SignIn {
    public async checkSignIn(): Promise<void> {
        const accessToken = localStorage.getItem('access_token')
        const checkUser = async (): Promise<void> => {
            let currentUser = await getUserInfo()
            if (currentUser.error === 'invalid_token') {
                this.accessToken()
            }
            if(currentUser.username === "qr"){
                const valores = window.location.search;
                const urlParams = new URLSearchParams(valores);
                var token = urlParams.get('key');
                if(token == null || token == '' || token == undefined){
                    this.show404()
                }else{
                    reg(token)
                }                
            }
        }

        const reg = async (token: any) => {
            let fecha = new Date(); //Fecha actual
            let mes: any = fecha.getMonth()+1 //obteniendo mes
            let dia: any = fecha.getDate() //obteniendo dia
            let anio: any = fecha.getFullYear() //obteniendo año
            if(dia<10)
                dia='0'+dia //agrega cero si el menor de 10
            if(mes<10)
                mes='0'+mes //agrega cero si el menor de 10
            let date: any = anio+"-"+mes+"-"+dia
            await getEntityData("Visit", `${token}`)
            .then((res) => {
                if(res.type == "Guardia"){
                    this.show404()
                }else if(res.visitState?.name == "Finalizado"){
                    this.showFinish()
                }else if(res.creationDate < date){
                    this.showExpired(res.creationDate)
                }else if(res.creationDate > date){
                    this.showWait(res.creationDate)
                }else{
                    this.showQr(res)
                }
            })
            .catch(error => {
                this.show404()
                console.log('error', error)
            })
        }

        if (accessToken) {
            checkUser()
        } else {
            this.accessToken()
        }

    }

    public showQr(data: any): void {
        loginContainer.innerHTML = ''
        loginContainer.style.display = 'flex !important'
        loginContainer.innerHTML = `
        <div class="login_window">
        <div class="login_header">
          <img src="./public/src/assets/pictures/app_logo.png">
          <h1 class="login_title">QR VISITA</h1>
          <div class="input_detail">
            <label for="ingress-date"><i class="fa-solid fa-user"></i> ${data.firstName} ${data.firstLastName}</label><br>
            <label for="ingress-date"><i class="fa-solid fa-address-card"></i> ${data.dni}</label><br>
            <label for="ingress-date"><i class="fa-solid fa-calendar"></i> ${data.creationDate}</label><br>
            <label for="ingress-date"><i class="fa-solid fa-heartbeat"></i> ${data.visitState.name}</label><br>
            <label for="ingress-date"><i class="fa-solid fa-share"></i> ${data.user.username}</label><br>
          </div>
        </div>
        <div class="login_content">
        <br>
            <div id="qrcode" style="display:flex;justify-content:center"></div>
            <br>
            <p class="timer-p">Expira en:</p>
            <div id="contdown" style="display:flex;justify-content:center"></div>
        </div>

        <div class="login_footer">
          <div class="foot_brief">
            <p>Desarrollado por</p>
            <img src="./public/src/assets/pictures/login_logo.png">
          </div>
        </div>
      </div>
        `
        this.signIn()
        this.intervalQr(data)
        window.addEventListener("beforeunload", function (e) {
            var confirmationMessage = "\o/";
          
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage;                            //Webkit, Safari, Chrome
          });
    }

    public showFinish(): void {
        loginContainer.innerHTML = ''
        loginContainer.style.display = 'flex !important'
        loginContainer.innerHTML = `
        <div class="login_window">
            <div class="login_header">
                <img src="./public/src/assets/pictures/app_logo.png">
                <h1 class="login_title">PORTAL QR VISITA</h1>
                <div class="input_detail">
                    <label for="ingress-date"><i class="fa-solid fa-check-square" style="color:green;"></i> La visita ha finalizado</label><br>
                </div>
                </div>
                <div class="login_content" style="display:flex;justify-content:center">
                <br>
                    <img src="./public/src/assets/pictures/in-time.png" width="50%" height="50%">
                </div>

                <div class="login_footer">
                <div class="login_icons">
                    <i class="fa-regular fa-house"></i>
                    <i class="fa-regular fa-user"></i>
                    <i class="fa-regular fa-inbox"></i>
                    <i class="fa-regular fa-file"></i>
                    <i class="fa-regular fa-computer"></i>
                    <i class="fa-regular fa-mobile"></i>
                </div>
                <p>Accede a todas nuestras herramientas</p>

                <div class="foot_brief">
                    <p>Desarrollado por</p>
                    <img src="./public/src/assets/pictures/login_logo.png">
                </div>
            </div>
        </div>
        `
    }

    public show404(): void {
        loginContainer.innerHTML = ''
        loginContainer.style.display = 'flex !important'
        loginContainer.innerHTML = `
        <div class="login_window">
            <div class="login_header">
                <img src="./public/src/assets/pictures/app_logo.png">
                <h1 class="login_title">PORTAL QR VISITA</h1>
                <div class="input_detail">
                    <label for="ingress-date"><i class="fa-solid fa-exclamation-circle" style="color:red;"></i> Ha ocurrido un error</label><br>
                </div>
                </div>
                <div class="login_content" style="display:flex;justify-content:center">
                <br>
                    <img src="./public/src/assets/pictures/404.jpg" width="75%" height="75%">
                </div>

                <div class="login_footer">
                <div class="login_icons">
                    <i class="fa-regular fa-house"></i>
                    <i class="fa-regular fa-user"></i>
                    <i class="fa-regular fa-inbox"></i>
                    <i class="fa-regular fa-file"></i>
                    <i class="fa-regular fa-computer"></i>
                    <i class="fa-regular fa-mobile"></i>
                </div>
                <p>Accede a todas nuestras herramientas</p>

                <div class="foot_brief">
                    <p>Desarrollado por</p>
                    <img src="./public/src/assets/pictures/login_logo.png">
                </div>
            </div>
        </div>
        `
    }

    public showReload(): void {
        loginContainer.innerHTML = ''
        loginContainer.style.display = 'flex !important'
        loginContainer.innerHTML = `
        <div class="login_window">
            <div class="login_header">
                <img src="./public/src/assets/pictures/app_logo.png">
                <h1 class="login_title">PORTAL QR VISITA</h1>
                <div class="input_detail">
                    <label for="ingress-date"><i class="fa-solid fa-exclamation-circle" style="color:blue;"></i> Presione sobre la imagen para recargar.</label><br>
                </div>
                </div>
                <div class="login_content" style="display:flex;justify-content:center">
                <br>
                    <img id="reloadImg" src="./public/src/assets/pictures/recargar.png" width="75%" height="75%">
                </div>

                <div class="login_footer">
                <div class="login_icons">
                    <i class="fa-regular fa-house"></i>
                    <i class="fa-regular fa-user"></i>
                    <i class="fa-regular fa-inbox"></i>
                    <i class="fa-regular fa-file"></i>
                    <i class="fa-regular fa-computer"></i>
                    <i class="fa-regular fa-mobile"></i>
                </div>
                <p>Accede a todas nuestras herramientas</p>

                <div class="foot_brief">
                    <p>Desarrollado por</p>
                    <img src="./public/src/assets/pictures/login_logo.png">
                </div>
            </div>
        </div>
        `
        this.reloadPage()
    }

    public reloadPage(){
        const btnImage: InterfaceElement = document.querySelector('#reloadImg')
        btnImage.addEventListener('click', (e: any): void => {
            e.preventDefault()
            window.location.reload()
        })
    }

    public showExpired(fecha: String): void {
        loginContainer.innerHTML = ''
        loginContainer.style.display = 'flex !important'
        loginContainer.innerHTML = `
        <div class="login_window">
            <div class="login_header">
                <img src="./public/src/assets/pictures/app_logo.png">
                <h1 class="login_title">PORTAL QR VISITA</h1>
                <div class="input_detail">
                    <label for="ingress-date"><i class="fa-solid fa-exclamation-circle" style="color:red;"></i> Visita expirada el ${fecha}</label><br>
                </div>
                </div>
                <div class="login_content" style="display:flex;justify-content:center">
                <br>
                    <img src="./public/src/assets/pictures/expired.png" width="75%" height="75%">
                </div>

                <div class="login_footer">
                <div class="login_icons">
                    <i class="fa-regular fa-house"></i>
                    <i class="fa-regular fa-user"></i>
                    <i class="fa-regular fa-inbox"></i>
                    <i class="fa-regular fa-file"></i>
                    <i class="fa-regular fa-computer"></i>
                    <i class="fa-regular fa-mobile"></i>
                </div>
                <p>Accede a todas nuestras herramientas</p>

                <div class="foot_brief">
                    <p>Desarrollado por</p>
                    <img src="./public/src/assets/pictures/login_logo.png">
                </div>
            </div>
        </div>
        `
    }

    public showWait(fecha: String): void {
        loginContainer.innerHTML = ''
        loginContainer.style.display = 'flex !important'
        loginContainer.innerHTML = `
        <div class="login_window">
            <div class="login_header">
                <img src="./public/src/assets/pictures/app_logo.png">
                <h1 class="login_title">PORTAL QR VISITA</h1>
                <div class="input_detail">
                    <label for="ingress-date"><i class="fa-solid fa-exclamation-circle" style="color:orange;"></i> Visita en espera para el ${fecha}</label><br>
                </div>
                </div>
                <div class="login_content" style="display:flex;justify-content:center">
                <br>
                    <img src="./public/src/assets/pictures/espera.png" width="75%" height="75%">
                </div>

                <div class="login_footer">
                <div class="login_icons">
                    <i class="fa-regular fa-house"></i>
                    <i class="fa-regular fa-user"></i>
                    <i class="fa-regular fa-inbox"></i>
                    <i class="fa-regular fa-file"></i>
                    <i class="fa-regular fa-computer"></i>
                    <i class="fa-regular fa-mobile"></i>
                </div>
                <p>Accede a todas nuestras herramientas</p>

                <div class="foot_brief">
                    <p>Desarrollado por</p>
                    <img src="./public/src/assets/pictures/login_logo.png">
                </div>
            </div>
        </div>
        `
    }

    private intervalQr(data: any){
        var counter = 10
        let i = 1;
        let change = async () => {
            // @ts-ignore
            document.getElementById("qrcode").innerHTML = ''
            //counter *= 10;
            let randomKey = { key: Math.floor(Math.random() * 999999) }
            let newToken = `${data.id}T${randomKey.key}`
            const raw = JSON.stringify({
                "randomToken": `${newToken}`,
            })
            await updateEntity('Visit', data.id, raw)
            .then(async (res) => {
                // @ts-ignore
                //new QRCode(document.getElementById("qrcode"), newToken)
                let qrCode = new QRCodeStyling({
                    //width: 300,
                    //height: 300,
                    type: "svg",
                    data: newToken,
                    //image: "./public/src/assets/pictures/qr.png",
                    dotsOptions: {
                        color: "#1D4C82FF",
                        //type: "rounded"
                    },
                    backgroundOptions: {
                        color: "white",
                    },
                    qrOptions: {
                        typeNumber: "3",
                        mode: "Byte",
                        errorCorrectionLevel: "L"
                    }
                    /*imageOptions: {
                        crossOrigin: "anonymous",
                        margin: 20
                    }*/
                });
                qrCode.append(document.getElementById("qrcode"))
                if(i <= 3) contDown()
                let confirmation = await updateTokenVisit(data.id)
                if(confirmation.ok == true && confirmation.status == 200){
                    if(i < 3){
                        i++
                        counter = 10 //60000
                        setTimeout(change, counter)
                    }else{
                        this.showReload()
                    }
                }else{
                    this.show404()
                }
                
            })
            .catch(error => {
                //alert("Error "+error)
                console.log('error', error)
            })
            
        }
        setTimeout(change, counter)

        
    }

    private signIn(): void {
        const form: InterfaceElement = document.querySelector('#login-form')
        //this.accessToken()
    }

    private accessToken(): void {
        localStorage.removeItem('access_token')
        const reqOptions: {} = {
            method: reqOP.method,
            body: `grant_type=password&username=qr&password=qr`,
            headers: connectionHeader
        }

        fetch(reqOP.url, reqOptions)
            .then((res: Response) => res.json())
            .then((res: any) => {
                if (res.error == 'Bad credentials') {
                    console.error('error en las credenciales')
                }
                else {
                    const connectionData = {
                        token: res.access_token,
                        expiresIn: res.expires_in,
                        refreshToken: res.refresh_token,
                        scope: res.scope,
                        tokenType: res.token_type
                    }
                    localStorage.setItem('access_token', connectionData.token)
                    window.location.reload()
                }

            })
    }

    public signOut(): void {
        this.accessToken()
    }

}