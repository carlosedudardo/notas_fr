$(document).ready(function(){

    let condicionGuardar = 0;
    let codigoBuscar = null;

    function cargarDatos(){
        conteo = 0
        var titulo = document.getElementById('titulo');
        $.ajax({
            method: 'get',
            url: 'http://localhost:8000/verEstudiantes'
        }).done((response)=>{
    
            const dataJson = JSON.parse(response);
            const estudiantes = dataJson.data;
            const table = document.getElementById('estudiantesTb');
            const tbody = table.getElementsByTagName('tbody')[0];
            let html = '';
            estudiantes.forEach(estudiante => {
                html+='<tr>'
                html+='      <td>' + estudiante.codigo+'</td>';
                html+='      <td>'+ estudiante.nombres+'</td>';
                html+='      <td>'+ estudiante.apellidos+'</td>';
                html+='      <td>';
                html+='          <button class="btnModificar" data-codigo="' + estudiante.codigo + '" >Modificar</button>';
                html+='      </td>';
                html+='      <td>';
                html+='          <button class="btnEliminar" data-codigo="' + estudiante.codigo + '" >Eliminar</button>';
                html+='      </td>';
                html+='      <td>';
                html+='          <button class="btnNotas" data-codigo="' + estudiante.codigo + '">Notas</button>';
                html+='      </td>';
                html+='</tr>';
                conteo ++;
            });
            tbody.innerHTML = html;

            if(conteo == 0){
                titulo.innerHTML = "No se registran estudiantes"
            }else{
                titulo.innerHTML = "Estudiantes registrados"
            }
    
        }).fail((error)=>{
            console.error(error);
        });
    }

    cargarDatos();

    //REGISTRAR ESTUDIANTES

    $(document).on("click", "#btnRegistrar", function(){

        //Mostrar el formulario al hacer clic en Registrar
        var formulario = document.getElementById('inputsContainer');
        var inputs = formulario.getElementsByTagName('input');
        inputsContainer.style.display = 'block';
        inputs[0].focus;

        var ocultar = document.getElementById('codigoId');
        ocultar.readOnly = false;

        document.getElementById('titulo').innerText = 'Registrar Estudiante';
        condicionGuardar = 1;
        clean();

    });

    //MODIFICAR ESTUDIANTES

    $(document).on("click", ".btnModificar", function(){

        //Mostrar el formulario al hacer clic en Registrar
        var formulario = document.getElementById('inputsContainer');
        var inputs = formulario.getElementsByTagName('input');
        inputsContainer.style.display = 'block';
        inputs[0].focus;
    
        document.getElementById('titulo').innerText = 'Modificar Estudiante';
        condicionGuardar = 2;

        codigoBuscar = $(this).data("codigo"); //Guarda en una variable el codigo recogido en las propiedades del boton Modificar
        var nombres = $(this).closest("tr").find("td:eq(1)").text(); //TR = Fila, TD = celda
        var apellidos = $(this).closest("tr").find("td:eq(2)").text();

        //Mostrar en los input los registros seleccionados
        $("#codigoId").val(codigoBuscar);
        $("#nombresId").val(nombres);
        $("#apellidosId").val(apellidos);

        var ocultar = document.getElementById('codigoId');
        ocultar.readOnly = true;
    
        });


    //ELIMINAR ESTUDIANTES

    $(document).on("click", ".btnEliminar", function(){

        codigoBuscar = $(this).data("codigo");

        $.ajax({
            url: 'http://localhost:8000/eliminarEstudiantes/' + codigoBuscar,
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

    //PROGRAMACIÓN DEL BOTÓN GUARDAR

    document.getElementById('btnGuardar').addEventListener('click', guardar);

    function guardar(){
        
        let codigo = document.getElementById('codigoId');
        let nombre = document.getElementById('nombresId');
        let apellido = document.getElementById('apellidosId');

        if(codigo.value.trim() === '' || nombre.value.trim() === '' || apellido.value.trim() === ''){

            alert ("No pueden haber campos vacios");
            location.reload();
            return

        }else if(codigo.value <= 0){

            alert ("El código no cumple con el formato");
            location.reload();
            return

        }else if(condicionGuardar == 1){

            $.ajax({
                url: 'http://localhost:8000/crearEstudiantes',
                method: 'post',
                data: {
                    codigo: codigo.value,
                    nombres: nombre.value,
                    apellidos: apellido.value
                }
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg)
                cargarDatos();
                inputsContainer.style.display = 'none';

            });

        }else if(condicionGuardar == 2){

            $.ajax({
                url: 'http://localhost:8000/modificarEstudiantes/' + codigoBuscar,
                method: 'put',
                data:{  
                         nombres: nombre.value,
                         apellidos: apellido.value
                     }
            }).done(response=>{
                const dataJson = JSON.parse(response);
                const msg = dataJson.data; 
                alert(msg);
                cargarDatos();
                inputsContainer.style.display = 'none';
            });
        }

    }

    //LIMPIAR LOS INPUT
    function clean(){
        let vacio = "";

        document.getElementById("codigoId").value = vacio;
        document.getElementById("nombresId").value = vacio;
        document.getElementById("apellidosId").value = vacio;
    };

    //CONFIGURAR BOTÓN NOTAS PARA DIRIGIRSE A OTRO HTML

    $(document).on("click", ".btnNotas", function(){

        codigoBuscar = $(this).data("codigo");
        var nombres = $(this).closest("tr").find("td:eq(1)").text();
        var apellidos = $(this).closest("tr").find("td:eq(2)").text();

        localStorage.setItem("codigo", codigoBuscar);
        localStorage.setItem("nombres", nombres);
        localStorage.setItem("apellidos", apellidos);

        window.location.href = 'actividades.html';

      });

});