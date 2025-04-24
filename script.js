document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const videoInput = document.getElementById('videoInput');
    const dropArea = document.getElementById('dropArea');
    const fileInfo = document.getElementById('fileInfo');
    const uploadBtn = document.getElementById('uploadBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const statusText = document.getElementById('statusText');
    const platformStatus = document.getElementById('platformStatus');
    
    // State variables
    let selectedFile = null;
    let isUploading = false;
    let uploadProgress = 0;
    let currentUploads = [];

    // Event Listeners
    function initEventListeners() {
        // File selection via click
        videoInput.addEventListener('change', handleFileInputChange);
        
        // Drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlightDropArea, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlightDropArea, false);
        });
        
        dropArea.addEventListener('drop', handleFileDrop);
        uploadBtn.addEventListener('click', handleUploadClick);
    }

    // Helper Functions
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlightDropArea() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlightDropArea() {
        dropArea.classList.remove('highlight');
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    }
    
    function validateFile(file) {
        const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
        const maxSize = 500 * 1024 * 1024; // 500MB
        
        if (!validTypes.includes(file.type)) {
            return { valid: false, message: 'Format file tidak didukung. Gunakan MP4, MOV, AVI, atau MKV.' };
        }
        
        if (file.size > maxSize) {
            return { valid: false, message: 'Ukuran file terlalu besar. Maksimal 500MB.' };
        }
        
        return { valid: true };
    }

    // File Handling
    function handleFileInputChange(e) {
        if (e.target.files.length) {
            const file = e.target.files[0];
            processSelectedFile(file);
        }
    }
    
    function handleFileDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file && file.type.startsWith('video/')) {
            processSelectedFile(file);
        } else {
            showFileError('Harap pilih file video yang valid');
        }
    }
    
    function processSelectedFile(file) {
        const validation = validateFile(file);
        
        if (!validation.valid) {
            showFileError(validation.message);
            return;
        }
        
        selectedFile = file;
        showFileInfo(`File terpilih: ${file.name} (${formatFileSize(file.size)})`);
        
        // Auto-fill title if empty
        if (!document.getElementById('title').value) {
            const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            document.getElementById('title').value = fileNameWithoutExt;
        }
    }
    
    function showFileInfo(message) {
        fileInfo.textContent = message;
        fileInfo.style.color = '#7f8c8d';
    }
    
    function showFileError(message) {
        fileInfo.textContent = message;
        fileInfo.style.color = 'red';
        selectedFile = null;
    }

    // Upload Functions
    function handleUploadClick() {
        if (isUploading) {
            alert('Upload sedang berjalan. Harap tunggu...');
            return;
        }
        
        if (!selectedFile) {
            alert('Harap pilih file video terlebih dahulu');
            return;
        }
        
        const platforms = getSelectedPlatforms();
        
        if (platforms.length === 0) {
            alert('Harap pilih setidaknya satu platform');
            return;
        }
        
        const videoInfo = getVideoInfo();
        startUploadProcess(platforms, videoInfo);
    }
    
    function getSelectedPlatforms() {
        const platforms = [];
        if (document.getElementById('tiktok').checked) platforms.push('tiktok');
        if (document.getElementById('shopee').checked) platforms.push('shopee');
        if (document.getElementById('youtube').checked) platforms.push('youtube');
        if (document.getElementById('facebook').checked) platforms.push('facebook');
        return platforms;
    }
    
    function getVideoInfo() {
        return {
            title: document.getElementById('title').value || 'Video Saya',
            description: document.getElementById('description').value || '',
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
    }
    
    function startUploadProcess(platforms, videoInfo) {
        isUploading = true;
        uploadProgress = 0;
        currentUploads = [];
        
        // UI Setup
        uploadBtn.disabled = true;
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        platformStatus.innerHTML = '';
        
        // Simulate platform preparation
        updateStatus('Mempersiapkan upload...');
        
        // Start upload simulation
        setTimeout(() => {
            simulatePlatformUploads(platforms, videoInfo);
        }, 1500);
    }
    
    function simulatePlatformUploads(platforms, videoInfo) {
        const totalSteps = platforms.length * 4; // 4 steps per platform
        let completedSteps = 0;
        
        platforms.forEach((platform, index) => {
            const platformName = getPlatformDisplayName(platform);
            
            // Step 1: Uploading
            setTimeout(() => {
                updateStatus(`Mengupload ke ${platformName}...`);
                addPlatformStatus(platform, 'pending', 'Memulai upload...');
                
                // Simulate upload progress
                simulateUploadProgress(platform, 0, 70, 1500, () => {
                    completedSteps++;
                    updateProgress(completedSteps, totalSteps);
                    
                    // Step 2: Processing
                    updateStatus(`Memproses video untuk ${platformName}...`);
                    updatePlatformStatus(platform, 'pending', 'Memproses video...');
                    
                    setTimeout(() => {
                        completedSteps++;
                        updateProgress(completedSteps, totalSteps);
                        
                        // Step 3: Adding metadata
                        updateStatus(`Menambahkan metadata ke ${platformName}...`);
                        updatePlatformStatus(platform, 'pending', 'Menambahkan metadata...');
                        
                        setTimeout(() => {
                            completedSteps++;
                            updateProgress(completedSteps, totalSteps);
                            
                            // Step 4: Finalizing
                            updateStatus(`Menyelesaikan upload ke ${platformName}...`);
                            updatePlatformStatus(platform, 'pending', 'Menyelesaikan...');
                            
                            setTimeout(() => {
                                completedSteps++;
                                updateProgress(completedSteps, totalSteps);
                                
                                // Random success/failure for simulation
                                const isSuccess = Math.random() > 0.2;
                                if (isSuccess) {
                                    updatePlatformStatus(platform, 'success', 'Upload berhasil!');
                                } else {
                                    updatePlatformStatus(platform, 'error', 'Gagal upload: Timeout');
                                }
                                
                                // Check if all uploads are done
                                if (completedSteps >= totalSteps) {
                                    finishUploadProcess();
                                }
                            }, 800);
                        }, 600);
                    }, 1000);
                });
            }, index * 1000); // Stagger platform uploads
        });
    }
    
    function simulateUploadProgress(platform, start, end, duration, callback) {
        const startTime = Date.now();
        const interval = 100; // ms
        const steps = (end - start) / (duration / interval);
        let current = start;
        
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            current = start + (steps * (elapsed / interval));
            
            if (current >= end || elapsed >= duration) {
                clearInterval(progressInterval);
                current = end;
                if (callback) callback();
            }
            
            // Update specific platform progress (not implemented in UI)
            // Could be added with more detailed progress bars per platform
        }, interval);
    }
    
    function updateProgress(completed, total) {
        const percentage = Math.min(Math.floor((completed / total) * 100), 100);
        progressBar.style.width = `${percentage}%`;
    }
    
    function updateStatus(message) {
        statusText.textContent = message;
    }
    
    function addPlatformStatus(platform, status, message) {
        const platformName = getPlatformDisplayName(platform);
        const statusDiv = document.createElement('div');
        statusDiv.id = `status-${platform}`;
        statusDiv.className = status;
        statusDiv.innerHTML = `<strong>${platformName}:</strong> ${message}`;
        platformStatus.appendChild(statusDiv);
        platformStatus.scrollTop = platformStatus.scrollHeight;
    }
    
    function updatePlatformStatus(platform, status, message) {
        const statusDiv = document.getElementById(`status-${platform}`);
        if (statusDiv) {
            statusDiv.className = status;
            const platformName = getPlatformDisplayName(platform);
            statusDiv.innerHTML = `<strong>${platformName}:</strong> ${message}`;
        }
    }
    
    function getPlatformDisplayName(platform) {
        const names = {
            'tiktok': 'TikTok',
            'shopee': 'Shopee Video',
            'youtube': 'YouTube Shorts',
            'facebook': 'Facebook Reels'
        };
        return names[platform] || platform;
    }
    
    function finishUploadProcess() {
        isUploading = false;
        uploadBtn.disabled = false;
        updateStatus('Semua upload selesai!');
        
        // Show completion summary
        const successCount = currentUploads.filter(u => u.status === 'success').length;
        const errorCount = currentUploads.filter(u => u.status === 'error').length;
        
        setTimeout(() => {
            if (errorCount > 0) {
                alert(`Upload selesai dengan ${successCount} berhasil dan ${errorCount} gagal.`);
            } else {
                alert('Semua video berhasil diupload!');
            }
        }, 500);
    }

    // Initialize
    initEventListeners();
});