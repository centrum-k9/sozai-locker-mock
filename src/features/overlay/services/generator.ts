import { OverlayConfig, OverlaySource, OverlayAppearance } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate CSS styles based on appearance settings
const generateOverlayCSS = (appearance: OverlayAppearance): string => {
  const {
    background,
    solidColor,
    cornerRadius,
    gap,
    nameStyle,
    highlightSpeaking,
  } = appearance;

  return `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background: ${background === 'transparent' ? 'transparent' : solidColor};
        overflow: hidden;
      }
      
      .overlay-root {
        width: 100vw;
        height: 100vh;
        padding: ${gap}px;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        gap: ${gap}px;
      }
      
      .overlay-root.layout-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        align-content: start;
      }
      
      .overlay-root.layout-list {
        flex-direction: column;
        width: auto;
        min-width: 300px;
      }
      
      .member {
        position: relative;
        display: flex;
        align-items: center;
        background: rgba(0, 0, 0, 0.7);
        border-radius: ${cornerRadius}px;
        padding: 12px;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 2px solid transparent;
      }
      
      .member.speaking {
        ${highlightSpeaking ? `
          border-color: #00ff88;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
          transform: scale(1.05);
        ` : ''}
      }
      
      .member-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 12px;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.2);
      }
      
      .member-standing {
        width: 64px;
        height: 80px;
        margin-right: 12px;
        object-fit: cover;
        border-radius: ${cornerRadius / 2}px;
      }
      
      .member-name {
        font-size: 16px;
        font-weight: 600;
        color: white;
        ${nameStyle === 'shadow' ? 'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);' : ''}
        ${nameStyle === 'stroke' ? '-webkit-text-stroke: 1px rgba(0, 0, 0, 0.8);' : ''}
      }
      
      @keyframes speaking-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      .member.speaking .member-name {
        animation: speaking-pulse 1s ease-in-out infinite;
      }
    </style>
  `;
};

// Generate JavaScript for real-time updates (mock)
const generateOverlayJS = (): string => {
  return `
    <script>
      // Mock speaking detection - randomly toggle speaking state
      function mockSpeakingDetection() {
        const members = document.querySelectorAll('.member');
        
        setInterval(() => {
          members.forEach(member => {
            // 10% chance to toggle speaking state per interval
            if (Math.random() < 0.1) {
              member.classList.toggle('speaking');
            }
          });
        }, 2000);
      }
      
      // Initialize when page loads
      document.addEventListener('DOMContentLoaded', () => {
        mockSpeakingDetection();
      });
      
      // URL parameter handling for customization
      const urlParams = new URLSearchParams(window.location.search);
      
      // Scale parameter
      const scale = parseFloat(urlParams.get('scale') || '1.0');
      if (scale !== 1.0) {
        document.body.style.transform = \`scale(\${scale})\`;
        document.body.style.transformOrigin = 'top left';
      }
      
      // Hide names parameter
      if (urlParams.get('hideNames') === '1') {
        const names = document.querySelectorAll('.member-name');
        names.forEach(name => name.style.display = 'none');
      }
    </script>
  `;
};

export const overlayGenerator = {
  async generateAggregateHTML(config: OverlayConfig, members: any[] = []): Promise<OverlaySource> {
    await delay(500);
    
    const { appearance, layout } = config;
    const css = generateOverlayCSS(appearance);
    const js = generateOverlayJS();
    
    // Generate member elements
    const memberElements = members.map((member, index) => {
      const avatarSrc = member.discordAvatar || member.standingImage || member.keyVisual || 'https://via.placeholder.com/64x64?text=' + (member.displayName?.[0] || 'U');
      const standingSrc = member.standingImage || member.keyVisual;
      
      return `
        <div class="member" data-user-id="${member.id || `member-${index}`}">
          ${appearance.showAvatar && !appearance.showStandingImage ? 
            `<img class="member-avatar" src="${avatarSrc}" alt="${member.displayName}" />` : ''
          }
          ${appearance.showStandingImage && standingSrc ? 
            `<img class="member-standing" src="${standingSrc}" alt="${member.displayName}" />` : ''
          }
          ${appearance.showName ? 
            `<div class="member-name">${member.displayName || 'Unknown'}</div>` : ''
          }
        </div>
      `;
    }).join('');
    
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Discord Overlay</title>
  ${css}
</head>
<body>
  <div class="overlay-root layout-${layout}">
    ${memberElements}
  </div>
  ${js}
</body>
</html>
    `.trim();
    
    return {
      html,
      downloadFileName: `overlay-aggregate-${config.id}.html`,
      hostedUrl: `/overlay/${config.id}`,
    };
  },

  async generateIndividualHTMLs(config: OverlayConfig, members: any[] = []): Promise<OverlaySource[]> {
    await delay(800);
    
    const sources: OverlaySource[] = [];
    
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const userAppearance = config.perUser?.[member.id] || config.appearance;
      
      const css = generateOverlayCSS(userAppearance);
      const js = generateOverlayJS();
      
      const avatarSrc = member.discordAvatar || member.standingImage || member.keyVisual || 'https://via.placeholder.com/64x64?text=' + (member.displayName?.[0] || 'U');
      const standingSrc = member.standingImage || member.keyVisual;
      
      const memberElement = `
        <div class="member" data-user-id="${member.id || `member-${i}`}">
          ${userAppearance.showAvatar && !userAppearance.showStandingImage ? 
            `<img class="member-avatar" src="${avatarSrc}" alt="${member.displayName}" />` : ''
          }
          ${userAppearance.showStandingImage && standingSrc ? 
            `<img class="member-standing" src="${standingSrc}" alt="${member.displayName}" />` : ''
          }
          ${userAppearance.showName ? 
            `<div class="member-name">${member.displayName || 'Unknown'}</div>` : ''
          }
        </div>
      `;
      
      const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Discord Overlay - ${member.displayName}</title>
  ${css}
</head>
<body>
  <div class="overlay-root layout-${config.layout}">
    ${memberElement}
  </div>
  ${js}
</body>
</html>
      `.trim();
      
      sources.push({
        html,
        downloadFileName: `overlay-${member.displayName?.replace(/[^a-zA-Z0-9]/g, '-') || 'member'}-${config.id}.html`,
        hostedUrl: `/overlay/${config.id}?user=${member.id}`,
      });
    }
    
    return sources;
  },
};