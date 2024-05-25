document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Display the uploaded image
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('uploadedImage').src = e.target.result;
    };
    reader.readAsDataURL(file);

    // Show the loader
    document.getElementById('loader').style.display = 'block';
    document.getElementById('extractedContent').innerHTML = '';

    // Perform OCR using Tesseract.js
    Tesseract.recognize(
        file,
        'eng',
        {
            logger: (m) => console.log(m)
        }
    ).then(({ data: { text } }) => {
        // Hide the loader
        document.getElementById('loader').style.display = 'none';

        // Split text into paragraphs
        const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
        const extractedContent = document.getElementById('extractedContent');

        paragraphs.forEach(para => {
            const pElement = document.createElement('p');
            pElement.textContent = para;
            extractedContent.appendChild(pElement);
        });
    }).catch(err => {
        console.error(err);
        // Hide the loader and show error message
        document.getElementById('loader').style.display = 'none';
        document.getElementById('extractedContent').innerText = 'Error extracting text. Please try again.';
    });
});
