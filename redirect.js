window.onload = function() {
    const tsUrl = `ts3server://${SERVER_ADDRESS}`;
    
    document.getElementById('meta-redirect').setAttribute('content', `0;url=${tsUrl}`);
    document.getElementById('manual-link').setAttribute('href', tsUrl);
    
    window.location.href = tsUrl;
}