const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, '../e:\\teste antigravity\\src\\components\\onboarding\\svgs'); // absolute from code

const actualDir = 'e:/teste antigravity/src/components/onboarding/svgs';

const files = fs.readdirSync(actualDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(actualDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace class prefix: e.g. 1_Ilustra\xE7\xE3o_inicial_svg__cls-1 -> svg1_cls-1
  // We can just find any sequence of [0-9]_.*?_svg__ and replace it with svg[0-9]_
  
  content = content.replace(/([0-9])_.*?(?:_svg__|_svg_1__)/g, (match, p1) => {
    return 'svg' + p1 + '_';
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
});

const cssPath = 'e:/teste antigravity/src/components/onboarding/OnboardingAnimations.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');
cssContent = cssContent.replace(/#([0-9])_.*?(?:_svg__|_svg_1__)/g, (match, p1) => {
  return '#svg' + p1 + '_';
});
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('Processed OnboardingAnimations.css');

