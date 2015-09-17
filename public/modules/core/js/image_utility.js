/**
 * Created by Proyecto on 17/09/2015.
 */
function getBase64Image(url,generatePdf) {
    var img = new Image();
    var dataURL;

    img.src = url;

    img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        dataURL = canvas.toDataURL('image/jpeg');
        generatePdf(dataUrl);
    }
}
var generatePdf= function generatePdf(imageData){
    /** this function receives the image param and creates the pdf with it**/
    var doc = new jsPDF();
    doc.addImage(imageData, "JPEG", 60,50);
    doc.save("test.pdf");
};

function generateImagePdf(url){
    getBase64Image(url, generatePdf);
}
