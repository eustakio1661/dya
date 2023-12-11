const _url = "https://apiformulario.adex.pe/";
// Configura DataTable en español y personaliza opciones
$(document).ready(function () {
  // Ruta del archivo JSON
  var rutaJSON = "https://apiformulario.adex.pe/obtener-json";

  // Realiza una solicitud AJAX para obtener los datos del archivo JSON
  $.ajax({
    url: rutaJSON,
    method: "GET",
    dataType: "json",
    success: function (datosJSON) {
      // Configura DataTable en español y personaliza opciones
      $("#miTabla").DataTable({
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json",
        },
        lengthChange: false,
        searching: false,
        responsive: true,
        info: false,
        paging: false,
        order: [[1, "asc"]], // Ordena por la segunda columna (índice 1) en orden ascendente
        data: datosJSON,
        columns: [
          { data: "descripcion" },
          {
            data: "estado",
            render: function (data, type, row) {
              return data
                ? '<span class="badge bg-danger">Reservado</span>'
                : '<span class="badge bg-success">Disponible</span>';
            },
          },
          {
            data: "persona",
            render: function (data, type, row) {
              // Retorna un botón si la propiedad 'persona' está vacía o nula
              return data
                ? ""
                : `<button type="button" class="btn btn-primary" id="RegistraPersona_${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="Registrar Nombre"><i class="fa-solid fa-user-plus fa-beat-fade"></i></button>`;
            },
          },
        ],
      });

      // Agrega un evento de clic al botón
      $("#miTabla tbody").on("click", "[id^='RegistraPersona']", function () {
        // Extrae el ID del botón
        let idProducto = this.id.split("_")[1];

        // Muestra el SweetAlert
        mostrarSweetAlert(idProducto);
      });
    },
    error: function (error) {
      console.error("Error al cargar el archivo JSON:", error);
    },
  });
});

function copiarAlPortapapeles(texto) {
  // Crea un elemento de texto oculto
  var input = document.createElement("textarea");
  input.value = texto;
  document.body.appendChild(input);

  // Selecciona el texto del elemento de texto
  input.select();
  input.setSelectionRange(0, 99999); // Para dispositivos móviles

  // Copia el texto al portapapeles
  document.execCommand("copy");

  // Elimina el elemento de texto ahora que ya ha sido copiado
  document.body.removeChild(input);
}

// Función para mostrar SweetAlert al hacer clic en el botón
function mostrarSweetAlert(idProducto) {
  Swal.fire({
    title: "Ingrese un nombre",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    preConfirm: (nombre) => {
      // Puedes realizar validaciones adicionales aquí si es necesario
      if (!nombre) {
        Swal.showValidationMessage("Debe ingresar un nombre");
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Almacena el nombre ingresado
      const nombreIngresado = result.value;

      // Muestra un segundo SweetAlert de confirmación con icono y colores personalizados
      Swal.fire({
        title: "¿Sus datos son correctos?",
        html: `Nombre: ${nombreIngresado}`, // Agrega el nombre al contenido del mensaje
        icon: "question", // Icono de pregunta
        showCancelButton: true,
        confirmButtonText: '<span style="color: white;">Sí</span>',
        cancelButtonText: '<span style="color: white;">No</span>',
        confirmButtonColor: "#28a745", // Color verde para el botón Sí
        cancelButtonColor: "#dc3545", // Color rojo para el botón No
        preConfirm: (confirmacion) => {
          // Puedes realizar acciones adicionales si es necesario
          if (confirmacion) {
            console.log("Datos confirmados:", nombreIngresado);
            // Realiza la lógica de registro si es necesario

            guardarJson(idProducto, nombreIngresado);
          } else {
            // Si no está de acuerdo, vuelve a solicitar el nombre
            mostrarSweetAlert();
          }
        },
      });
    }
  });
}

function guardarJson(idProducto, nombreIngresado) {
  // Realiza una solicitud POST con los parámetros en la URL
  $.ajax({
    type: "POST",
    url: _url + "act-producto",
    data: {
      idProducto: idProducto,
      nombreIngresado: nombreIngresado,
    },
    success: function (response) {
      console.log(response);
      // Si la respuesta contiene el mensaje esperado, recarga la página
      if (response && response.mensaje === "Producto actualizado correctamente") {
        location.reload();
      } else {
        // Si la respuesta no es la esperada, muestra un SweetAlert con el mensaje de error
        mostrarSweetAlertError(response && response.mensaje ? response.mensaje : "Error al actualizar datos. Por favor, intenta nuevamente o contacta al número 943447957");
      }
    },
    error: function (error) {
      console.error("Error al actualizar datos:", error);
      // Muestra un SweetAlert con el mensaje de error
      mostrarSweetAlertError("Error al actualizar datos. Por favor, intenta nuevamente o contacta al número 943447957");
    },
  });
}

// Función para mostrar SweetAlert con mensaje de error
function mostrarSweetAlertError(mensaje) {
  Swal.fire({
    title: "Error",
    text: mensaje,
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

