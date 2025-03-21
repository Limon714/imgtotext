document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');
    const resultContainer = document.getElementById('resultContainer');
    const extractBtn = document.getElementById('extractBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const extractedText = document.getElementById('extractedText');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressContainer = document.getElementById('progressContainer');
    const uploadLabel = document.querySelector('.upload-label');

    // Variables
    let selectedImage = null;

    // Event Listeners
    imageUpload.addEventListener('change', handleImageUpload);
    extractBtn.addEventListener('click', extractTextFromImage);
    copyBtn.addEventListener('click', copyTextToClipboard);
    downloadBtn.addEventListener('click', downloadTextAsFile);

    // Drag and Drop functionality
    uploadLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadLabel.classList.add('drag-active');
    });

    uploadLabel.addEventListener('dragleave', () => {
        uploadLabel.classList.remove('drag-active');
    });

    uploadLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadLabel.classList.remove('drag-active');
        
        if (e.dataTransfer.files.length) {
            imageUpload.files = e.dataTransfer.files;
            handleImageUpload({ target: imageUpload });
        }
    });

    // Functions
    function handleImageUpload(event) {
        const file = event.target.files[0];
        
        if (file && file.type.match('image.*')) {
            selectedImage = file;
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                previewContainer.style.display = 'block';
                extractBtn.disabled = false;
                
                // Reset previous results
                resultContainer.style.display = 'none';
                extractedText.value = '';
                copyBtn.disabled = true;
                downloadBtn.disabled = true;
                resetProgress();
            };
            
            reader.readAsDataURL(file);
        }
    }

    function extractTextFromImage() {
        if (!selectedImage) return;
        
        // Show result container and progress
        resultContainer.style.display = 'block';
        progressContainer.style.display = 'block';
        extractedText.value = 'Processing...';
        
        // Disable extract button during processing
        extractBtn.disabled = true;
        
        // Reset progress
        resetProgress();
        
        // Use Tesseract.js to extract text
        Tesseract.recognize(
            selectedImage,
            'eng', // Language (English)
            {
                logger: progress => updateProgress(progress)
            }
        ).then(({ data: { text } }) => {
            // Display extracted text
            extractedText.value = text;
            
            // Enable copy and download buttons
            copyBtn.disabled = false;
            downloadBtn.disabled = false;
            
            // Re-enable extract button
            extractBtn.disabled = false;
            
            // Hide progress bar after completion
            progressContainer.style.display = 'none';
        }).catch(error => {
            console.error('Error during text extraction:', error);
            extractedText.value = 'Error extracting text. Please try again.';
            extractBtn.disabled = false;
        });
    }

    function updateProgress(progress) {
        if (progress.status === 'recognizing text') {
            const percentage = Math.round(progress.progress * 100);
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${percentage}%`;
        }
    }

    function resetProgress() {
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
    }

    function copyTextToClipboard() {
        extractedText.select();
        document.execCommand('copy');
        
        // Visual feedback for copy
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1500);
    }

    function downloadTextAsFile() {
        const text = extractedText.value;
        if (!text) return;
        
        const filename = `extracted-text-${new Date().toISOString().slice(0, 10)}.txt`;
        const blob = new Blob([text], { type: 'text/plain' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
