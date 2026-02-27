const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/pages/Schedule.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace standard terms
content = content.replace(/bg-paper/g, 'bg-background');
content = content.replace(/text-charcoal\/60/g, 'text-muted-foreground');
content = content.replace(/text-charcoal\/50/g, 'text-muted-foreground');
content = content.replace(/text-charcoal\/80/g, 'text-foreground/80');
content = content.replace(/text-charcoal\/40/g, 'text-foreground/40');
content = content.replace(/text-charcoal/g, 'text-foreground');
content = content.replace(/<Navigation variant="light" \/>/g, '<Navigation />');

content = content.replace(/border-charcoal\/20/g, 'border-border');
content = content.replace(/border-charcoal\/10/g, 'border-border');
content = content.replace(/border-charcoal\/5/g, 'border-border');
content = content.replace(/border-charcoal/g, 'border-border');

content = content.replace(/hover:bg-charcoal\/5/g, 'hover:bg-white/5');
content = content.replace(/bg-charcoal\/5/g, 'bg-white/5');

content = content.replace(/bg-charcoal text-white/g, 'bg-foreground text-background');
content = content.replace(/hover:bg-charcoal/g, 'hover:bg-foreground hover:text-background');
content = content.replace(/group-hover:bg-charcoal/g, 'group-hover:bg-foreground group-hover:text-background');

// specific tweaks
content = content.replace(/bg-white/g, 'bg-transparent'); // existing white blocks
content = content.replace(/bg-transparent border border-border rounded-none shadow-sm/g, 'bg-white/5 border border-white/10 rounded-xl shadow-lg backdrop-blur-md');
content = content.replace(/bg-transparent border border-border/g, 'bg-white/5 border border-white/10 rounded-xl shadow-lg backdrop-blur-md');

content = content.replace(/text-foreground text-background border-foreground/g, 'text-background border-white');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done rewriting Schedule.tsx');
