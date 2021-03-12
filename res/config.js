
var vrTitle = ''; 
var vrSubTitle = ''; 
var vrDescription = ''; 

/* --- START VIEW ------------------------------------ */
var startPan = 13; 			/* left is negative, right is positive value */
var startTilt = -2; 		
var startZoom = 1.0; 		/* 0.6 - 1.4 */

/* --- PARTIAL PANORAMA ------------------------------ */
var useLimits = false;
var TopLimit = 60;  		/* 0 - 90 */
var BottomLimit = -60;		/* 0 - -90 */
var leftLimit = -120; 		/* 0 - 180 */
var rightLimit = 120; 		/* 0 - 180*/

/* --- AUTO ROTATE ----------------------------------
Auto rotate, returns view to horizont and sets zoom to 1 */

var enableAutoButton = true; /* Auto rotate button, if clicked overrides autoRotateOnIdle */
var autoRotateOnStart = false; 
var autoRotateOnIdle = false; 
var autoRotateDelay = 15; /* seconds, works with Rotate on strat or Rotate on idle. */ 
/* -------------------------------------------------- */

	
/* --- BACKGROUND AUDIO ----------------------------- 
Background sound is available only on the iPad, if browser is online. 
Overwrite sound.mp3 in folder "vr_files/sound" 
var enableSound = true; */

var enableSound = false;


var flashPage = '';



var useLogo = false;
var useOfflineInfo = false; /* works with useLogo = true */
var linkLogo = false;
var linkLogoURL = 'www.vrhabitat.com';
var urlConfirm = 'Open VRhabitat.com?';


/* --- OTHER ------------------------------------- */
var bgdColor = '#FFFFFF'; 					/* Background color of the page */
var informWhenOfflineAvailable = true;		/* Notification when Safari if finished caching the files for offline use */
var showNotifications = true;				/* Notifications about pano limits, zoom limits etc. */

/* DO NOT change next lines */
var consoleLog = false;			