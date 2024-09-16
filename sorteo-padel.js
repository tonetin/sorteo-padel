        var arJugadores = [];
        var arJugadores2 = [];
        var arPistas = [];

        var AR_JUG_DCHA = ["patty", "julie", "maria", "maría", "alexander", "ilde", "ildefonso", "rosendo"]
        var AR_JUG_IZQ = ["lucas", "william"]

        let avisado = false;
        
        window.addEventListener("load", comienzo);
        
        /* window.onload = "comienzo()"; */

        let txtJugadores = document.getElementById("txtAreaJugadores");
        txtJugadores.addEventListener("input", activarBtSortear);

        function avisar() {
            if (avisado == false) {
                window.alert("Los siguientes grupos de jugadores no coindirán en la misma pareja:\n\n" +
                          "* DERECHA: Patty, Maria, Julie, Alexander, Ildefonso y Rosendo\n" +
                          "* REVES: Lucas y William\n\n" +
                          "PARA FIJAR OTROS JUGADORES en la derecha o el revés añadir dd o ii al final del nombre");    
                avisado = true;
            }
        }

        function anadirPistas() {
            if (document.getElementById("txtPistas").value == "") {
                document.getElementById("txtPistas").value = "5 6 7";       
            } 
        }

        function comienzo() {
            /* Desactivar botones y txtArea de partidos */
            document.getElementById("btSortear").disabled = true;
            document.getElementById("btCopiar").disabled = true;
            document.getElementById("txtAreaPartidos").disabled = true; 
        }

        function activarBtSortear(event){
            var btSortear = document.getElementById("btSortear");
            if (btSortear.disabled == true) {
                btSortear.disabled = false
            }
        }

        function sortear(event) {
            var txtJugadores = document.getElementById("txtAreaJugadores").value;
            var jugadoresOk = true;

            txtJugadores = (txtJugadores.trim());
           
            /* Comprobaciones no esta vacío */
            jugadoresOk =  !(txtJugadores.length == 0);
            
            if (jugadoresOk == false) {
                alert("La lista esta vacia");
            } else {
                /* Buscar comienzo y recortar */
                const ind1 = txtJugadores.indexOf("1");
                if (ind1 == -1) {
                    /* No hay caracter de comienzo */
                    jugadoresOk = false;
                    alert("No hay comienzo de la lista (1)")
                } else {
                    /* Recortar hasta el caracter de comienzo */
                    txtJugadores = txtJugadores.substring(ind1 + 1);
                }
            }

            if (jugadoresOk == true) {
                /* Creación del array */
                arJugadores = txtJugadores.split("\n");

                /* Borrar caracteres antes de cada nombre */
                for (let indArray = 0; indArray < arJugadores.length; indArray++) {
                    let salir = false;
                    while (salir == false) {
                        arJugadores[indArray] = arJugadores[indArray].trim();
                        let ascii = arJugadores[indArray].toUpperCase().charCodeAt(0);
                        if (ascii > 64 && ascii < 91) {
                            salir = true;
                        } else {
                            arJugadores[indArray] = arJugadores[indArray].substr(1);
                        }
                    }    
                }; 
                
                /* Comprobación del número de jugadores */
                if ((arJugadores.length % 4) != 0) {
                    alert("El número de jugadores no es múltiplo de 4");
                    jugadoresOk = false;
                }
            }

            if (jugadoresOk == false) {
                document.getElementById("txtAreaJugadores").value = "";
                document.getElementById("btSortear").disabled = true;
            } else {
                crearPartidos();
            }

            return;
        } /* Fin de la función sortear */


        function crearPartidos() {
            var arParejas = [];
            var arParejas2 = [];
            const NJUGADORES = arJugadores.length;

            var numPatty = -1
            var numLucas = -1
            
            /* alert("Tenemos "+ NJUGADORES + " jugadores"); */
            var salida = "";

            /* Establecer los números de pista */
            arPistas = document.getElementById("txtPistas").value.trim().split(" ");

            /* Creación array jugadores en orden aleatorio */
            for (let ind = 0; ind < NJUGADORES; ind++) {
                arJugadores2[ind] = "";
            }

            /* alert("Array de jugadores tiene " + arJugadores.length + " jugadores") */

            /* Incluir primero los jugadores de lado exclusivo:
               primera mitad los de derecha, segunda mitad los de izquieeda */

            let numDcha = 0;
            let numIzq = 0; 
            let arJugSin = [];
            avisoDcha = false;
            avisoIzq = false

            for (let ind = 0; ind < NJUGADORES; ind++) {
                jugador = arJugadores[ind].toLowerCase();
                esDchaIzq = false;
                /* alert("Trabajando " + jugador) */
                
                if (AR_JUG_DCHA.includes(jugador) || jugador.slice(-2) == "dd") {
                    if (numDcha < NJUGADORES / 2) {
                        limInf = 0;
                        limSup = NJUGADORES / 2 - 1;
                        esDchaIzq = true;
                        numDcha += 1 
                    } else {
                        if (avisoDcha == false) {
                            alert("¡OOPS! Demasiados jugadores de derecha.\nAlguno no se tendrá en cuenta")
                            avisoDcha = true
                        }
                        arJugSin.push(arJugadores[ind])
                    }
                } else if (AR_JUG_IZQ.includes(jugador) || jugador.slice(-2) == "ii") {
                    if (numIzq < NJUGADORES / 2) {
                        limInf = NJUGADORES / 2
                        limSup = NJUGADORES - 1
                        esDchaIzq = true;
                        numIzq += 1 
                    } else {
                        if (avisoIzq == false) {
                            alert("¡OOPS! Demasiados jugadores de revés.\nAlguno no se tendrá en cuenta")
                            avisoIzq = true
                        }
                        arJugSin.push(arJugadores[ind])  
                    }
                } else {   /* sin preferencia de lado */
                    arJugSin.push(arJugadores[ind]) 
                }


                if (esDchaIzq) {
                    let numValido = false;
                    if (["dd", "ii"].includes(arJugadores[ind].slice(-2))) {
                        arJugadores[ind] = arJugadores[ind].slice(0, -2)
                    }
                    while (numValido == false) {
                        let nuevoInd = getRandomIntInclusive(limInf, limSup);
                        
                        if (arJugadores2[nuevoInd] == "") {
                            if (arJugadores[ind].toLowerCase() == "patty") {
                                numPatty = nuevoInd;
                                if ((numLucas != -1) && (numLucas == numPatty + (NJUGADORES/2))) {
                                    numPatty = -1;
                                } else  {
                                    arJugadores2[nuevoInd] = arJugadores[ind];
                                    numValido = true;
                                }
                                /* alert("Terminada Patty. Numero " + numPatty + " seguimos " + numValido) */
                            } else if (arJugadores[ind].toLowerCase() == "lucas") {
                                    numLucas = nuevoInd;
                                    /* alert("Llegamos hasta aquí. Lucas") */
                                    /* alert("Patty: " + numPatty + " Lucas: " + numLucas) */
                                    if ((numPatty != -1) && (numLucas == (numPatty + (NJUGADORES/2)))) {
                                        numLucas = -1;
                                    } else {
                                        arJugadores2[nuevoInd] = arJugadores[ind];
                                        numValido = true;
                                    }
                            } else {
                                arJugadores2[nuevoInd] = arJugadores[ind];
                                numValido = true;
                            }
                            
                        }    
                    }
                }
            }    


            for (let ind = 0; ind < arJugSin.length; ind++) {
                let numValido = false;
                if (["dd", "ii"].includes(arJugSin[ind].slice(-2))) {
                    arJugSin[ind] = arJugSin[ind].slice(0, -2)
                }
                while (numValido == false) {
                    let nuevoInd = getRandomIntInclusive(0, NJUGADORES - 1);
                    if (arJugadores2[nuevoInd] == "") {
                        arJugadores2[nuevoInd] = arJugSin[ind];
                        numValido = true;
                    }
                }
            }
            /* alert("Jugadores derecha: " +  numDcha + ". Jugadores izquierda: " + numIzq); */

            /* Creacion de parejas del primer partido */
            const NPAREJAS = NJUGADORES / 2;
            const NPISTAS = NPAREJAS / 2;

            /* Calcular desplazamiento, distinto del que hace coincidir a Patty y Lucas */
        
            let desplazam = getRandomIntInclusive(1, (NJUGADORES/2 - 1));
            if (numPatty != -1 && numLucas != -1) {
                while ((NJUGADORES/2) + ((numPatty + desplazam) % (NJUGADORES/2)) == numLucas) {
                    desplazam = getRandomIntInclusive(1, (NJUGADORES/2 - 1));    
                }
            } 
            /* alert("Patty: " + numPatty + " Lucas: " + numLucas + " Desplaz: " + desplazam); */
            
            for (let ind = 0; ind < NPAREJAS; ind++) {
                arParejas[ind] = arJugadores2[ind] + " y " + arJugadores2[ind + (NJUGADORES/2)]       
            }

            for (let ind = 0; ind < NPAREJAS; ind++) {
                arParejas2[ind] = arJugadores2[ind] + " y " + arJugadores2[(NJUGADORES/2) + ((ind + desplazam) % (NJUGADORES/2))];
            }

            
            /* Asignacion de pistas y partidos */

            for (let partido = 1; partido < 3; partido++) {

                var arParejaSalida = [].concat(partido == 1 ? arParejas : arParejas2);

                salida = salida + "== " + (partido == 1 ? "PRIMER" : "SEGUNDO") + " PARTIDO ==\n";

                var cuentaPistas = 0;
                var numPareja;
                while (cuentaPistas < (arParejaSalida.length / 2)) {
                    
                    salida = salida + "\nPISTA ";
                    if (arPistas.length > cuentaPistas && arPistas[cuentaPistas].trim() != "") {
                        salida = salida + arPistas[cuentaPistas] + ":";         
                    }
                    salida = salida + "\n";
                    for (let numParejaPista = 1; numParejaPista < 3; numParejaPista++) {
                        let parejaBuena = false;
                        while (parejaBuena == false) {
                            numPareja = getRandomIntInclusive(0, arParejaSalida.length - 1);
                            if (arParejaSalida[numPareja] != "") {
                                salida = salida + "  " + arParejaSalida[numPareja] + "\n";
                                salida = salida + (numParejaPista == 1 ? "     VS\n" : "");
                                arParejaSalida[numPareja] = "";
                                parejaBuena = true;
                            }
                        }
                    }
                    cuentaPistas = cuentaPistas + 1;  
                }
                salida = salida + "\n"
            }

            document.getElementById("txtAreaPartidos").disabled = false;
            document.getElementById("txtAreaPartidos").value = salida;
            document.getElementById("btCopiar").disabled = false;

        } /* Fin de la función crear partidos */


        function copiar() {
            /* Copia el area de texto de partidos al portapapeles */
            var texto = document.getElementById("txtAreaPartidos").value;
            copyToClipboard(texto);
            return
        }


        /* Generador de numeros aleatorios enteros entrte min y max, incluyendo ambos */
        function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
        }


        function copyToClipboard(texto) {
            navigator.clipboard.writeText(texto)
            .then(() => {
                alert("Contenido copiado al portapapeles");
                /* Resuelto - texto copiado al portapapeles con éxito */
            },() => {
                alert("Error al copiar");
                /* Rechazado - fallo al copiar el texto al portapapeles */
            });
        }

        