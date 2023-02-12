$(document).delegate("#img-upload", "click", async function () {
  var base64Kep;
  try {
    await codeTheFile();
    await sendTheFile();
  } catch (error) {
    console.log(error);
  }
  finally {
    window.location.assign('/')
  }

  function codeTheFile() {
    return new Promise((resolve, reject) => {

      let kep = $("#kepInput").prop("files")[0];

      let reader = new FileReader();
      reader.readAsDataURL(kep);
      reader.onload = async function () {
        base64Kep = reader.result;
        resolve(base64Kep);
      };
    });
  };

  function sendTheFile(){
    let nev = $("#nevInput").val();
    let ar = $("#arInput").val();
    return new Promise((resolve, reject) => {
      var settings = {
        url: "http://86.59.230.107:3005/upload",
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          nev: nev,
          ar: ar,
          kep: base64Kep,
        }),
      };

      $.ajax(settings).done(function (response) {
        console.log(response);
        resolve(response);
      });
    });
  };
});
