/**
 * CBC Document Converter - Application Logic
 * Handles file uploads, conversions, and UI interactions
 */

class ConverterApp {
    constructor() {
        this.currentMode = 'pdf-to-word';
        this.selectedFile = null;
        this.isConverting = false;
        this.conversionResult = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.setupDragAndDrop();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        // File handling
        this.uploadZone = document.getElementById('uploadZone');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.fileIcon = document.getElementById('fileIcon');
        this.fileTypeHint = document.getElementById('fileTypeHint');
        this.removeFileBtn = document.getElementById('removeFileBtn');
        
        // Conversion controls
        this.convertBtn = document.getElementById('convertBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.convertAnotherBtn = document.getElementById('convertAnotherBtn');
        
        // UI sections
        this.progressContainer = document.getElementById('progressContainer');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.statusMessage = document.getElementById('statusMessage');
        this.successSection = document.getElementById('successSection');
        
        // Mode tabs
        this.tabButtons = document.querySelectorAll('.tab-button');
    }

    /**
     * Attach event listeners to elements
     */
    attachEventListeners() {
        // Tab/Mode switching
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchMode(e.currentTarget));
        });

        // File handling
        this.uploadZone.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));
        this.removeFileBtn.addEventListener('click', () => this.removeFile());

        // Conversion
        this.convertBtn.addEventListener('click', () => this.startConversion());

        // Success actions
        this.downloadBtn.addEventListener('click', () => this.downloadFile());
        this.convertAnotherBtn.addEventListener('click', () => this.resetForm());
    }

    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.uploadZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            document.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            this.uploadZone.addEventListener(eventName, () => {
                this.uploadZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.uploadZone.addEventListener(eventName, () => {
                this.uploadZone.classList.remove('drag-over');
            });
        });

        // Handle dropped files
        this.uploadZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFileSelect(files);
        });
    }

    /**
     * Switch conversion mode (PDF to Word or Word to PDF)
     */
    switchMode(button) {
        // Update active tab
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update mode
        this.currentMode = button.getAttribute('data-mode');

        // Update file type hint
        if (this.currentMode === 'pdf-to-word') {
            this.fileTypeHint.textContent = 'Supported: PDF files (max 50MB)';
            this.fileInput.accept = '.pdf';
        } else {
            this.fileTypeHint.textContent = 'Supported: Word documents - .docx, .doc (max 50MB)';
            this.fileInput.accept = '.docx,.doc';
        }

        // Reset form when switching modes
        this.resetForm();
    }

    /**
     * Handle file selection
     */
    handleFileSelect(files) {
        if (!files || files.length === 0) return;

        const file = files[0];

        // Validate file type
        const validTypes = this.currentMode === 'pdf-to-word'
            ? ['application/pdf']
            : ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (!validTypes.includes(file.type)) {
            this.showStatus('error', `Invalid file type. Please select a ${this.currentMode === 'pdf-to-word' ? 'PDF' : 'Word'} file.`);
            return;
        }

        // Validate file size (50MB max)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showStatus('error', 'File is too large. Maximum size is 50MB.');
            return;
        }

        // Store selected file
        this.selectedFile = file;

        // Update UI
        this.displayFileInfo(file);
        this.hideStatus();
        this.convertBtn.disabled = false;
    }

    /**
     * Display file information
     */
    displayFileInfo(file) {
        // Set file name and size
        this.fileName.textContent = file.name;
        this.fileSize.textContent = this.formatFileSize(file.size);

        // Set file icon based on type
        if (file.type === 'application/pdf') {
            this.fileIcon.textContent = '📄';
        } else if (file.type.includes('word')) {
            this.fileIcon.textContent = '📘';
        }

        // Show file info section
        this.fileInfo.style.display = 'block';

        // Smooth scroll to show file info
        this.fileInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Remove selected file
     */
    removeFile() {
        this.selectedFile = null;
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        this.successSection.style.display = 'none';
        this.convertBtn.disabled = true;
        this.hideStatus();
    }

    /**
     * Start file conversion
     */
    startConversion() {
        if (!this.selectedFile || this.isConverting) return;

        this.isConverting = true;
        this.convertBtn.disabled = true;

        // Show progress bar
        this.progressContainer.style.display = 'block';
        this.hideStatus();

        // Simulate conversion progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 90) progress = 90;

            this.updateProgress(progress);

            if (!this.isConverting) {
                clearInterval(interval);
            }
        }, 300);

        // Perform actual conversion (API call to Python backend)
        this.performConversion()
            .then((result) => {
                clearInterval(interval);
                this.updateProgress(100);

                // Show success after brief delay
                setTimeout(() => {
                    this.handleConversionSuccess(result);
                }, 500);
            })
            .catch((error) => {
                clearInterval(interval);
                this.handleConversionError(error);
            })
            .finally(() => {
                this.isConverting = false;
                this.convertBtn.disabled = false;
            });
    }

    /**
     * Perform conversion via API
     */
    async performConversion() {
        // Create form data
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('mode', this.currentMode);

        try {
            // Call Python backend API
            const response = await fetch('/api/convert', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type') || '';
                let message = `Conversion failed (${response.status})`;

                if (contentType.includes('application/json')) {
                    const error = await response.json();
                    message = error.error || error.message || message;
                } else {
                    const text = await response.text();
                    message = text ? text.slice(0, 300) : message;
                }

                throw new Error(message);
            }

            // Get the filename from Content-Disposition header
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'converted-file';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/)
                if (filenameMatch) filename = filenameMatch[1];
            }

            // Get the blob (converted file)
            const blob = await response.blob();
            return { blob, filename };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Handle successful conversion
     */
    handleConversionSuccess(result) {
        this.conversionResult = result;
        this.progressContainer.style.display = 'none';

        // Show success section
        this.successSection.style.display = 'block';
        this.successSection.scrollIntoView({ behavior: 'smooth' });

        this.showStatus('success', 'Your file has been converted successfully!');
    }

    /**
     * Handle conversion error
     */
    handleConversionError(error) {
        this.progressContainer.style.display = 'none';
        this.convertBtn.disabled = false;

        const errorMessage = error.message || 'An error occurred during conversion. Please try again.';
        this.showStatus('error', errorMessage);

        console.error('Conversion error:', error);
    }

    /**
     * Update progress bar
     */
    updateProgress(percent) {
        this.progressFill.style.width = percent + '%';
        this.progressText.textContent = `Converting: ${Math.round(percent)}%`;
    }

    /**
     * Download converted file
     */
    downloadFile() {
        if (!this.conversionResult) return;

        // Create download link from blob
        const link = document.createElement('a');
        link.href = URL.createObjectURL(this.conversionResult.blob);
        link.download = this.conversionResult.filename || 'converted-file';

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        URL.revokeObjectURL(link.href);
    }

    /**
     * Reset form for new conversion
     */
    resetForm() {
        this.removeFile();
        this.progressContainer.style.display = 'none';
        this.successSection.style.display = 'none';
        this.fileInfo.style.display = 'none';
        this.fileInput.value = '';
        this.selectedFile = null;
        this.conversionResult = null;
        this.convertBtn.disabled = true;
        this.hideStatus();

        // Scroll to top
        document.querySelector('.upload-zone').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Show status message
     */
    showStatus(type, message) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message show ${type}`;

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => this.hideStatus(), 5000);
        }
    }

    /**
     * Hide status message
     */
    hideStatus() {
        this.statusMessage.classList.remove('show');
        this.statusMessage.className = 'status-message';
    }
}

/**
 * Initialize the app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.converterApp = new ConverterApp();
});

/**
 * Service Worker Registration (for offline capability - future enhancement)
 */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered:', registration);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}

/**
 * Keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + U to open file browser
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        document.getElementById('fileInput').click();
    }

    // Ctrl/Cmd + Enter to convert (if file is selected)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (window.converterApp && window.converterApp.selectedFile) {
            e.preventDefault();
            window.converterApp.startConversion();
        }
    }

    // Escape to reset form
    if (e.key === 'Escape') {
        if (window.converterApp && window.converterApp.selectedFile) {
            window.converterApp.resetForm();
        }
    }
});

/**
 * Accessibility enhancements
 */
document.addEventListener('keydown', (e) => {
    // Tab navigation for mode selection
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length > 0 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        const activeButton = document.querySelector('.tab-button.active');
        const buttons = Array.from(tabButtons);
        const currentIndex = buttons.indexOf(activeButton);

        let nextIndex = currentIndex;
        if (e.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        } else if (e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % buttons.length;
        }

        buttons[nextIndex].click();
        buttons[nextIndex].focus();
    }
});

/**
 * Analytics tracking (optional - update with your tracking service)
 */
function trackEvent(eventName, eventData = {}) {
    // Placeholder for analytics implementation
    console.log('Event tracked:', eventName, eventData);
    
    // Example: Send to Google Analytics
    // if (window.gtag) {
    //     gtag('event', eventName, eventData);
    // }
}

// Track initial page load
trackEvent('page_view', {
    page_title: 'PDF to Word Converter',
    timestamp: new Date().toISOString()
});
