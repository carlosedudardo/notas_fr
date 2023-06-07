window.onload = function(){
    var nombres = localStorage.getItem("nombres");
    var apellidos = localStorage.getItem("apellidos");
    var codigoEstudiante = localStorage.getItem("codigo");

    document.getElementById('nombreText').innerText = "Nombre: " + nombres;
    document.getElementById('apellidoText').innerText = "Apellido: " + apellidos;

    let condicionGuardar = 0;
    let id = null;

    function cargarDatos(){
        var calcularPromedio = 0;
        var contadorNotas = 0;
        var sumaNotas = 0;
        var texto = document.getElementById('promedio');
        var titulo = document.getElementById('validarTexto');
        $.ajax({
            method: 'get',
            url: 'http://localhost:8000/verActividad/' + codigoEstudiante,
        }).done((response)=>{
    
            const dataJson = JSON.parse(response);
            const actividades = dataJson.data;
            const table = document.getElementById('actividadesTb');
            const tbody = table.getElementsByTagName('tbody')[0];
            let html = '';
            actividades.forEach(actividad => {
                html+='<tr>'
                html+='      <td>' + actividad.id +'</td>';
                html+='      <td>'+ actividad.descripcion +'</td>';
                html+='      <td>'+ actividad.nota +'</td>';
                html+='      <td class="table-content">';
                html+='          <button class="btnModificarAct" data-id="' + actividad.id + '" >Modificar</button>';
                html+='      </td>';
                html+='      <td>';
                html+='          <button class="btnEliminarAct" data-id="' + actividad.id + '" >Eliminar</button>';
                html+='      </td>';
                html+='</tr>';

                contadorNotas = contadorNotas + 1;
                sumaNotas = parseFloat(sumaNotas) + parseFloat(actividad.nota);

            });
            tbody.innerHTML = html;

            if(contadorNotas == 0){
                titulo.innerHTML = "El estudiante no registra actividades"
                texto.innerHTML = "<label style='color: white'>Promedio: No se han registrado actividades"
            }else{
                titulo.innerHTML = "Actividades registradas"
                calcularPromedio = (sumaNotas / contadorNotas);

                if(Number.isInteger(calcularPromedio)){
                    
                    if(calcularPromedio >= 3){
                        texto.innerHTML = "<label style='color: white'>Felicitaciones " + nombres + " " + apellidos +"," + '<label style="color: green"> el promedio es de: ' + calcularPromedio.toFixed(0) + '<label style="color: white"> aprobaste ';
                    }else if(calcularPromedio < 3){
                        texto.innerHTML = "<label style='color: white'>Lo siento " + nombres + " " + apellidos + "," + '<label style="color: red"> el promedio es de: ' + calcularPromedio.toFixed(0) + '<label style="color: white"> reprobaste ';
                    }

                }else{

                    if(calcularPromedio >= 3){
                        texto.innerHTML = "<label style='color: white'>Felicitaciones " + nombres + " " + apellidos + "," + '<label style="color: green"> el promedio es de: ' + calcularPromedio.toFixed(2) + '<label style="color: white"> aprobaste ';
                    }else if(calcularPromedio < 3){
                        texto.innerHTML = "<label style='color: white'>Lo siento " + nombres + " " + apellidos + "," + '<label style="color: red"> el promedio es de: ' + calcularPromedio.toFixed(2) + '<label style="color: white"> reprobaste ';
                    }
                }

            }

        }).fail((error)=>{
            console.error(error);
        });
    }
    
    cargarDatos();

    //REGISTRAR ACTIVIDAD

    $(document).on("click", "#btnRegistrarAct", function(){

        //Mostrar el formulario al hacer clic en Registrar
        var formulario = document.getElementById('inputsContainerAct');
        var inputs = formulario.getElementsByTagName('input');
        inputsContainerAct.style.display = 'block';
        inputs[0].focus;

        document.getElementById('tituloAct').innerText = 'Registrar Actividad';
        condicionGuardar = 1;
        clean();

    });

    //MODIFICAR ACTIVIDAD

    $(document).on("click", ".btnModificarAct", function(){

        //Mostrar el formulario al hacer clic en Registrar
        var formulario = document.getElementById('inputsContainerAct');
        var inputs = formulario.getElementsByTagName('input');
        inputsContainerAct.style.display = 'block';
        inputs[0].focus;

        condicionGuardar = 2;
        id = $(this).data("id"); //Guarda en una variable el id recogido en las propiedades del boton Modificar
        var descripcion = $(this).closest("tr").find("td:eq(1)").text(); //TR = Fila, TD = celda
        var nota = $(this).closest("tr").find("td:eq(2)").text();

        $("#descripcionId").val(descripcion);
        $("#notaId").val(nota);

    });

    //ELIMINAR ACTIVIDAD

    $(document).on("click", ".btnEliminarAct", function(){

        id = $(this).data("id");

        $.ajax({
            url: 'http://localhost:8000/eliminarActividad/' + id,
            method: 'delete',
        }).done(response=>{
            const dataJson = JSON.parse(response);
            const msg = dataJson.data; 
            alert(msg);
            cargarDatos();

        }).fail(error=>{
            const dataJson = JSON.parse(response);
            const msg = dataJson.data; 
            alert(msg);
        });
    
        });

    //PROGRAMACIÓN BOTÓN GUARDAR
    
    $(document).on("click", "#btnGuardarAct", function(){

        var descripcion = document.getElementById('descripcionId');
        var nota = document.getElementById('notaId');

        if(descripcion.value.trim() === '' || nota.value.trim() === ''){

            alert ("No pueden haber campos vacios");
            location.reload();
            return

        }else if(nota.value < 0 || nota.value > 5){

            alert ("La nota no cumple el formato");
            location.reload();
            return

        } else if(condicionGuardar == 1){

            $.ajax({
                url: 'http://localhost:8000/crearActividad',
                method: 'post',
                data: {
                    descripcion: descripcion.value,
                    nota: nota.value,
                    codigoEstudiante: codigoEstudiante
                }
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg)
                cargarDatos();
                inputsContainerAct.style.display = 'none';
            });

        }else if(condicionGuardar == 2){

            $.ajax({
                url: 'http://localhost:8000/modificarActividad/' + id,
                method: 'put',
                data:{  
                        descripcion: descripcion.value,
                        nota: nota.value
                     }
            }).done(response=>{
                const dataJson = JSON.parse(response);
                const msg = dataJson.data; 
                alert(msg);
                cargarDatos();
                inputsContainerAct.style.display = 'none';
            });
        }

    });

}

$(document).on("click", "#btnRegresar", function(){

    window.location.href = 'index.html';

});

function clean(){
    let vacio = "";

    document.getElementById("descripcionId").value = vacio;
    document.getElementById("notaId").value = vacio;
};
