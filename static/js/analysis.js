/*=============== FILE UPLOAD PREVIEW ===============*/
const fileInput = document.getElementById('file-input');
const filePreview = document.getElementById('file-preview');

if (fileInput) {
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.addEventListener('load', function() {
                filePreview.innerHTML = `
                    <img src="${this.result}" alt="Preview" style="max-width: 100%; max-height: 180px; border-radius: 0.5rem;">
                `;
            });
            
            reader.readAsDataURL(file);
        }
    });
}

/*=============== DRAG AND DROP ===============*/
if (filePreview) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        filePreview.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        filePreview.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        filePreview.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        filePreview.classList.add('highlight');
    }
    
    function unhighlight() {
        filePreview.classList.remove('highlight');
    }
    
    filePreview.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            fileInput.files = files;
            const file = files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.addEventListener('load', function() {
                    filePreview.innerHTML = `
                        <img src="${this.result}" alt="Preview" style="max-width: 100%; max-height: 180px; border-radius: 0.5rem;">
                    `;
                });
                
                reader.readAsDataURL(file);
            }
        }
    }
}

/*=============== DOWNLOAD REPORT ===============*/
const downloadReportBtn = document.getElementById('download-report');

if (downloadReportBtn) {
    downloadReportBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the result content
        const resultContainer = document.querySelector('.result__container');
        const resultStatus = document.querySelector('.result__status h3').textContent;
        const resultImage = document.querySelector('.result__image').src;
        const date = new Date().toLocaleDateString();
        
        // Create a simple report
        const reportContent = `
            PneumoCheck Analysis Report
            ===========================
            Date: ${date}
            
            Result: ${resultStatus}
            
            This report is for informational purposes only and should not replace professional medical advice.
            Please consult with a healthcare professional for a definitive diagnosis.
            
            PneumoCheck.com
        `;
        
        // Create a blob and download
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `pneumocheck-report-${date}.txt`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    });
}