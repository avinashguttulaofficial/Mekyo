const fs = require('fs');
const path = require('path');
const dir = './src/pages/admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/import \{ db \} from '\.\.\/\.\.\/lib\/storage';/g, 'import * as api from \'../../lib/api\';');
  content = content.replace(/import \{ db \} from "\.\.\/\.\.\/lib\/storage";/g, 'import * as api from \'../../lib/api\';');
  
  content = content.replace(/db\.savePrompt\(/g, 'api.savePrompt(');
  content = content.replace(/db\.deletePrompt\(/g, 'api.deletePrompt(');
  content = content.replace(/db\.saveCategory\(/g, 'api.saveCategory(');
  content = content.replace(/db\.deleteCategory\(/g, 'api.deleteCategory(');
  content = content.replace(/db\.saveUser\(/g, 'api.saveUser(');
  content = content.replace(/db\.moderateReview\(/g, 'api.moderateReview(');
  content = content.replace(/db\.deleteReview\(/g, 'api.deleteReview(');
  content = content.replace(/db\.saveSubscription\(/g, 'api.saveSubscription(');
  content = content.replace(/db\.saveSettings\(/g, 'api.saveSettings(');
  content = content.replace(/db\.updateMessageStatus\(/g, 'api.updateMessageStatus(');
  
  // Replace synchronous getters in admin components with empty arrays or null since they should be updated to use Context or useEffect
  content = content.replace(/db\.getUsers\(\)/g, '[]');
  content = content.replace(/db\.getSubscriptions\(\)/g, '[]');
  content = content.replace(/db\.getMessages\(\)/g, '[]');
  content = content.replace(/db\.getAllReviewsForAdmin\(\)/g, '[]');
  
  fs.writeFileSync(filePath, content);
});
console.log('Done');
