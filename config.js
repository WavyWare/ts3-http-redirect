const SERVER_CONFIG = {
    // Required: Server address (IP or hostname)
    address: "YOURSERVERADDRESS",
    
    // Optional: Server port (default: 9987)
    port: 9987,
    
    // Optional: Channel ID to join automatically
    channelId: null,
    
    // Optional: Channel password
    channelPassword: null,
    
    // Optional: Default nickname
    nickname: null,
    
    // Optional: Server password
    serverPassword: null,
    
    // Optional: Custom server name for display
    serverName: "Serwer TeamSpeak"
};

// For backwards compatibility
const SERVER_ADDRESS = SERVER_CONFIG.address;
