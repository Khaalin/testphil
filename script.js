const video = document.getElementById('video');
const playPauseButton = document.getElementById('play-pause');
const playPauseIcon = playPauseButton.querySelector('i');
const backward15Button = document.getElementById('backward-15');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const hoverProgress = document.getElementById('hover-progress');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const volumeControl = document.getElementById('volume-control');
const volumeIcon = document.getElementById('volume-icon');
const expandButton = document.getElementById('expand');
const expandIcon = expandButton.querySelector('i');
const videoContainer = document.getElementById('custom-player');
const signUpButton = document.getElementById('sign-up');
const timerElement = document.getElementById('timer');
const accessClosedMessage = document.getElementById('access-closed-message');

// Set this to change the timer duration (in seconds)
const TIMER_DURATION_SECONDS = 24 * 60 * 60; // 24 hours

function startTimer() {
    const endTime = localStorage.getItem('videoEndTime');
    
    if (!endTime) {
        const now = new Date();
        const end = new Date(now.getTime() + TIMER_DURATION_SECONDS * 1000);
        localStorage.setItem('videoEndTime', end.getTime());
    }

    function updateTimer() {
        const now = new Date();
        const end = new Date(parseInt(localStorage.getItem('videoEndTime')));
        const timeLeft = end - now;

        if (timeLeft <= 0) {
            timerElement.textContent = "00:00:00";
            videoContainer.style.display = 'none';
            accessClosedMessage.style.display = 'block';
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        setTimeout(updateTimer, 1000);
    }

    updateTimer();
}

startTimer();

playPauseButton.addEventListener('click', togglePlayPause);
backward15Button.addEventListener('click', backward15);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('ended', onVideoEnded);
progressBar.addEventListener('click', seekVideo);
progressBar.addEventListener('mousemove', updateHoverProgress);
progressBar.addEventListener('mouseleave', () => hoverProgress.style.width = '0%');
volumeControl.addEventListener('input', updateVolume);
document.addEventListener('keydown', handleKeyPress);
video.addEventListener('click', togglePlayPause);

function togglePlayPause() {
    if (video.paused || video.ended) {
        video.play().catch(e => console.error("Error playing video:", e));
        playPauseIcon.className = 'fas fa-pause';
    } else {
        video.pause();
        playPauseIcon.className = 'fas fa-play';
    }
    showPlayPauseOverlay();
}

function showPlayPauseOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'play-pause-overlay';
    overlay.innerHTML = `<i class="fas ${video.paused ? 'fa-play' : 'fa-pause'}"></i>`;
    videoContainer.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            videoContainer.removeChild(overlay);
        }, 300);
    }, 300);
}

function backward15() {
    video.currentTime = Math.max(0, video.currentTime - 15);
}

function updateProgress() {
    const progressPercentage = (video.currentTime / video.duration) * 100;
    progress.style.width = progressPercentage + '%';
    currentTimeSpan.textContent = formatTime(video.currentTime);
}

function initializeVideo() {
    durationSpan.textContent = formatTime(video.duration);
}

function seekVideo(e) {
    const clickPosition = (e.offsetX / progressBar.offsetWidth);
    const seekTime = clickPosition * video.duration;
    if (seekTime < video.currentTime) {
        video.currentTime = seekTime;
    }
}

function updateHoverProgress(e) {
    const hoverPosition = (e.offsetX / progressBar.offsetWidth) * 100;
    const currentPosition = (video.currentTime / video.duration) * 100;
    if (hoverPosition <= currentPosition) {
        hoverProgress.style.width = hoverPosition + '%';
    } else {
        hoverProgress.style.width = currentPosition + '%';
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateVolume() {
    video.volume = volumeControl.value;
    updateVolumeIcon();
}

function updateVolumeIcon() {
    volumeIcon.className = 'fas';
    if (video.volume === 0) {
        volumeIcon.classList.add('fa-volume-mute');
    } else if (video.volume < 0.5) {
        volumeIcon.classList.add('fa-volume-down');
    } else {
        volumeIcon.classList.add('fa-volume-up');
    }
}

function onVideoEnded() {
    playPauseIcon.className = 'fas fa-play';
    signUpButton.style.display = 'block';
}

function toggleExpand() {
    videoContainer.classList.toggle('expanded');
    if (videoContainer.classList.contains('expanded')) {
        expandIcon.className = 'fas fa-compress';
        enterFullScreen(videoContainer);
    } else {
        expandIcon.className = 'fas fa-expand';
        exitFullScreen();
    }
}

function enterFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

function handleKeyPress(e) {
    if (e.key === 'Escape' && videoContainer.classList.contains('expanded')) {
        toggleExpand();
    }
}

expandButton.addEventListener('click', toggleExpand);

window.onload = function() {
    
    const endTime = localStorage.getItem('videoEndTime');
    if (endTime && new Date() >= new Date(parseInt(endTime))) {
        videoContainer.style.display = 'none';
        accessClosedMessage.style.display = 'block';
        timerElement.textContent = "00:00:00";
    }
};


// localStorage.removeItem('videoEndTime');