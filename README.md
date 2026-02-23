# TS3 HTTP Redirect

Simple web-based redirect tool for TeamSpeak 3 servers with enhanced user experience and error handling.

## Features

- ✅ Automatic redirect to TeamSpeak 3 client
- 🎨 Modern, responsive design with dark/light theme support
- 🔧 Extensive configuration options
- 🛡️ Input validation and error handling
- 📱 Mobile-friendly interface
- ♿ Accessibility features
- 🔄 Retry mechanism for failed redirects
- 📊 Progress indication and status updates

## Configuration

Edit `config.js` to configure your server:

```javascript
const SERVER_CONFIG = {
    address: "ts.example.com",        // Required: Server address
    port: 9987,                       // Optional: Port (default: 9987)
    channelId: 123,                   // Optional: Auto-join channel ID
    channelPassword: "secret",        // Optional: Channel password
    nickname: "WebUser",              // Optional: Default nickname
    serverPassword: "serverpass",     // Optional: Server password
    serverName: "My TS Server"        // Optional: Display name
};
```

## URL Parameters

Users can also pass parameters via URL:
- `?channel=123` - Join specific channel
- `?nick=Username` - Set nickname
- `?pass=password` - Server password

## Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ⚠️ Mobile browsers (limited TS3 protocol support)

## Troubleshooting

If redirects don't work:
1. Ensure TeamSpeak 3 client is installed
2. Check browser's protocol handler settings
3. Try the manual link button
4. Disable popup blockers temporarily

## License

Open source - feel free to modify and distribute.