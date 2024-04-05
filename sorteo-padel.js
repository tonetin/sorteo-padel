        var arJugadores = [];
        var arJugadores2 = [];
        
        window.onload = comienzo();

        const txtJugadores = document.getElementById("txtAreaJugadores");
        txtJugadores.addEventListener("input", activarBtSortear);

        function comienzo() {
            /* Desactivar botones y txtArea de partidos */
            document.getElementById("btSortear").disabled = true;
            document.getElementById("btCopiar").disabled = true;
            document.getElementById("txtAreaPartidos").disabled = true; 
        }

        function activarBtSortear(event){
            btSortear = document.getElementById("btSortear");
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
                    let indCar = 0;
                    while (salir == false) {
                        arJugadores[indArray] = arJugadores[indArray].trim();
                        let ascii = arJugadores[indArray].toUpperCase().charCodeAt(0);
                        if (ascii > 64 && ascii < 91) {
                            salir = true;
                        } else {
                            arJugadores[indArray] = arJugadores[indArray].substr(indCar + 1);
                            ++indCar
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
            /* alert("Tenemos "+ NJUGADORES + " jugadores"); */
            var salida = "";

            /* Creación array jugadores en orden aleatorio */
            for (let ind = 0; ind < NJUGADORES; ind++) {
                arJugadores2[ind] = "";
            }
            for (let ind = 0; ind < NJUGADORES; ind++) {
                let numValido = false;
                while (numValido == false) {
                    let nuevoInd = getRandomIntInclusive(0, NJUGADORES);
                    if (arJugadores2[nuevoInd] == "") {
                        arJugadores2[nuevoInd] = arJugadores[ind];
                        numValido = true;
                    }
                }
            }
            /* alert("El array ordenado aleatoriamente es " + arJugadores2); */

            /* Creacion de parejas del primer partido */
            const NPAREJAS = NJUGADORES / 2;
            const DESPLAZAM = getRandomIntInclusive(1, (NJUGADORES/2 - 1));
            const NPISTAS = NPAREJAS / 2;

            for (let ind = 0; ind < NPAREJAS; ind++) {
                arParejas[ind] = arJugadores2[ind] + " y " + arJugadores2[ind + (NJUGADORES/2)]
            }

            for (let ind = 0; ind < NPAREJAS; ind++) {
                arParejas2[ind] = arJugadores2[ind] + " y " + arJugadores2[(NJUGADORES/2) + ((ind + DESPLAZAM) % (NJUGADORES/2))];
            }

            /* Asignacion de pistas y partidos */

            for (let partido = 1; partido < 3; partido++) {

                var arParejaSalida = [].concat(partido == 1 ? arParejas : arParejas2);

                salida = salida + "==== " + (partido == 1 ? "PRIMER" : "SEGUNDO") + " PARTIDO ====\n";

                var cuentaPistas = 0;
                var numPareja;
                while (cuentaPistas < (arParejaSalida.length / 2)) {
                    salida = salida + "\nPISTA: \n" + "---------\n";
                    
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