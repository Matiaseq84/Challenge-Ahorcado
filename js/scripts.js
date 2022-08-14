const bienvenida = document.querySelector('#bienvenida')
const ahorcado = document.querySelector('#ahorcado')
const agregar = document.querySelector('.agregar-palabra')
const btnCancelar = document.querySelector('.cancelar')
const btnIniciar = document.querySelector('#iniciar')
const btnDesistir = document.querySelector('#desistir')
const btnNuevoJuego = document.querySelector('#nuevo')
const btnAgregar = document.querySelector('#agregar')

const dibujoAhorcado =  document.querySelector('.dibujo-ahorcado')

const generadorPalabra = {
    palabras: ['MANZANA', 'CAMION', 'MARTILLO', 'PELOTA'],
    palabraSecreta: ''
} 

const usuarioPalabra = {
    intentos: -1,
    letrasIngresadas: [],
   
}

eventListeners()

function eventListeners() {

    btnIniciar.addEventListener('click', iniciarJuego)

    btnAgregar.addEventListener('click', agregarPalabra)

    btnCancelar.addEventListener('click', () => {
        agregar.style.display = 'none'
        bienvenida.style.display = 'block'
    })

    btnDesistir.addEventListener('click', desistirJuego)

    btnNuevoJuego.addEventListener('click', nuevoJuego)


}

function desistirJuego() {
    bienvenida.style.display = 'block'
    ahorcado.style.display = 'none'
    limpiarHTML()
}

function nuevoJuego() {

    limpiarUser()

    limpiarHTML()

    generarPalabra()

    generarInput()

    comprobarLetras()
}

function iniciarJuego() {
    
    bienvenida.style.display = 'none'
    ahorcado.style.display = 'block'

    limpiarHTML()

    generarPalabra()

    generarInput()

    comprobarLetras()

}

function agregarPalabra() {
    bienvenida.style.display = 'none'
    ahorcado.style.display = 'none'   
    document.querySelector('.agregar-palabra').style.display = 'block'

    guardarPalabra()

}

function guardarPalabra() {

    const btnGuardarPalabra = document.querySelector('.guardar-palabra')

    btnGuardarPalabra.onclick = () => {
        const nuevaPalabra = document.querySelector('#palabra')
        console.log(nuevaPalabra.value)
 
        if (/[A-Z]/.test(nuevaPalabra.value) && !/[\W_]/.test(nuevaPalabra.value) && nuevaPalabra.value != '' && nuevaPalabra.value <= 8 && !generadorPalabra.palabras.includes(nuevaPalabra.value))    {
            const palabraInput = nuevaPalabra.value.toLocaleUpperCase()
            generadorPalabra.palabras = [...generadorPalabra.palabras, palabraInput]
            bienvenida.style.display = 'none'
            ahorcado.style.display = 'block'
            iniciarJuego()
        }
    } 
    
}

function generarPalabra() {

    const random = Math.round(Math.random() * (generadorPalabra.palabras.length - 1))  
    generadorPalabra.palabraSecreta = generadorPalabra.palabras[random].toLocaleUpperCase()
    console.log(random)
    console.log(generadorPalabra.palabraSecreta)
}

function generarInput() {

    const { palabraSecreta } = generadorPalabra  
    const divPalabra = document.querySelector('.palabra')
    
    for(let i = 0; i < palabraSecreta.length; i++) {
        const inputLetra = document.createElement('input')
        inputLetra.type = 'text'
        inputLetra.dataset.letra = palabraSecreta[i].toLocaleUpperCase()
        inputLetra.className = 'letra'

        divPalabra.appendChild(inputLetra)
        
    }

}

function comprobarLetras() {

    document.querySelector('.aviso-mayuscula').focus()

    let { intentos, letrasIngresadas } = usuarioPalabra
    const { palabraSecreta } = generadorPalabra
    
    let palabra = []

    const inputLetras = document.querySelectorAll('.letra') 

    document.onkeypress = e => {

        if (/[A-Z]/.test(e.key) && !/[\W_]/.test(e.key) && e.key !== 'Alt' && e.key !== 'CapsLock' && e.key !== 'Shift' && e.key !== 'Control') {
            inputLetras.forEach((data, i) => {

                if (e.key == data.getAttribute('data-letra')) {
                    data.value = e.key
                    data.disabled = true

                    palabra[i] = data.value

                    if (palabra.join('') == palabraSecreta) {

                        mensajeFin('Ganaste, FELICIDADES!')
                        return
                    }

                } else {

                    if (!letrasIngresadas.includes(e.key) && !palabraSecreta.includes(e.key)) {
                        letrasIngresadas.push(e.key)
                        intentos++
                        imprimirLetras(e.key)
                        dibujarAhorcado(intentos)
                    }
                }
            })
        }
    }

}

function imprimirLetras(letra) {

    const letrasDiv = document.querySelector('.letras-ingresadas')
    const letraSpan = document.createElement('span')
    letraSpan.className = 'letra-ingresada'
    letraSpan.textContent = letra

    letrasDiv.appendChild(letraSpan)

}

function dibujarAhorcado(intentos) {
    
    document.querySelector('.dibujo-ahorcado').style.display = 'block'

    const ahorcado = document.querySelectorAll('.parte-cuerpo')
    const inputLetras = document.querySelectorAll('.letra')

    if(intentos <= 8) ahorcado[intentos].style.display = 'block'

    if(intentos == 8) {
        inputLetras.forEach(input => input.disabled = true)
        mensajeFin('PERDISTE', 'perder')
        return
                
    }
  
}

function mensajeFin(mensaje, tipo) {

    const mensajeDiv = document.querySelector('.mensaje')
    const mensajeP = document.createElement('p')

    if(tipo == 'perder') {
        mensajeP.classList.add('perdedor')
        mensajeP.textContent = mensaje
        mensajeDiv.appendChild(mensajeP)
        
    } else {
        
        mensajeP.classList.add('ganador')
        mensajeP.textContent = mensaje
        mensajeDiv.appendChild(mensajeP)

    }

    setTimeout(() => {
        mensajeP.remove()

        limpiarHTML()
    }, 3500)

}

function limpiarHTML() {

    const palabraInput = document.querySelector('.palabra')
    const letrasDiv = document.querySelector('.letras-ingresadas')
    const parteCuerpo = document.querySelectorAll('.parte-cuerpo')

    while(palabraInput.firstChild) {
        palabraInput.removeChild(palabraInput.firstChild)
    }

    while(letrasDiv.firstChild) {
        letrasDiv.removeChild(letrasDiv.firstChild)
    }

    parteCuerpo.forEach(parte => parte.style.display= 'none')

}

function limpiarUser() {
    usuarioPalabra.letrasIngresadas = []
    intentos= -1
}