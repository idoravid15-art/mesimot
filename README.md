# המטלות שלנו — מדריך הקמה

רשימת מטלות משותפת לזוג. סנכרון בזמן אמת, בלי שרת ובלי עלות.
GitHub Pages לאחסון, Firebase Realtime Database לנתונים.

---

## שלב 1 — פרויקט Firebase

1. היכנס ל-<https://console.firebase.google.com> ולחץ **Add project**. שם: `mesimot`. אפשר לכבות Analytics.
2. בתפריט הצד: **Databases and storage → Realtime Database → Create Database**.
   בחר אזור (europe-west1) ואז **Start in locked mode**.
3. לשונית **Rules** באותו מסך — מחק הכול והדבק את התוכן של `database.rules.json`, ולחץ **Publish**.
4. **Authentication → Get started → Sign-in method → Anonymous → Enable → Save**.
5. חזור ל-**Project Overview**. מתחת לשם הפרויקט יש כפתור **+ Add app** — לחץ עליו ובחר
   **Web** (`</>`). כינוי: `mesimot`, בלי Hosting. לחץ **Register app** ויוצג בלוק
   `firebaseConfig` — העתק אותו.
   *(בקונסולה הישנה זה היה תחת Project settings → General → Your apps.)*

## שלב 2 — הדבקת ההגדרות

פתח את `index.html` וחפש בסביבות שורה 480 את הבלוק:

```js
const FIREBASE = { apiKey: "PASTE_API_KEY", ... };
```

החלף את כל הערכים בערכים שהעתקת. חשוב: ודא ש-`databaseURL` קיים — לפעמים Firebase לא כולל אותו
ואז צריך להעתיק אותו ידנית מהשורה העליונה במסך ה-Realtime Database. שים לב שהוא בנוי על **מזהה**
הפרויקט ולא על שמו — למשל `https://mesimot-adef5-default-rtdb.europe-west1.firebasedatabase.app`.

הדבק את **אותו** בלוק גם בתוך `firebase-messaging-sw.js`.

## שלב 3 — מפתח התראות

**Project settings → Cloud Messaging → Web configuration → Web Push certificates → Generate key pair**.
העתק את המפתח והדבק ב-`index.html`:

```js
const VAPID_KEY = "PASTE_VAPID_PUBLIC_KEY";
```

(אפשר לדלג בשלב ראשון — האפליקציה תעבוד, פשוט בלי התראות.)

## שלב 4 — העלאה ל-GitHub Pages

```bash
git init
git add .
git commit -m "משימות משותפות"
git branch -M main
git remote add origin https://github.com/<user>/mesimot.git
git push -u origin main
```

ב-GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
תוך דקה־שתיים האתר יהיה חי בכתובת `https://<user>.github.io/mesimot/`.

## שלב 5 — הפעלה ראשונה ושיתוף

1. פתח את הכתובת. תתבקש להזין שני שמות — זה קורה פעם אחת בלבד.
2. עבור ל**הגדרות → שיתוף** והעתק את הקישור. הוא מכיל `#h=...` — זה מזהה הבית.
   **רק הקישור הזה** מוביל לרשימה שלכם.
3. שלח את הקישור לשניהם. בכניסה הראשונה כל אחד בוחר "מי אני?" והמכשיר זוכר.
4. בטלפון: פתח את הקישור בספארי/כרום ← **שיתוף → הוספה למסך הבית**.
   בלי זה, התראות באייפון לא יעבדו.

---

## איך לכתוב משימה מהר

השדה בהוספה מבין עברית. אפשר לכתוב הכול בשורה אחת:

| מה שכותבים | מה שקורה |
|---|---|
| `לקנות חלב מחר` | תאריך יעד = מחר |
| `לאסוף את הילדים ב-16:30 היום` | היום, בשעה 16:30 |
| `לשלם ועד בית כל חודש` | משימה חוזרת חודשית |
| `להוציא זבל כל יום ראשון` | חוזרת שבועית, מתחילה ביום ראשון הקרוב |
| `לקבוע רופא בעוד שבועיים` | תאריך יעד בעוד שבועיים |
| `לתקן את הדוד !!` | מסומנת כדחופה |
| `נייר טואלט #קניות` | נכנסת לרשימת הקניות |

## מבנה הנתונים

```
households/{hid}/
  meta      { name, createdAt }
  members   { a:{name,emoji,tokens}, b:{...} }
  lists     { listId: {name, emoji, kind:'tasks'|'shopping', order} }
  tasks     { taskId: {title, notes, listId, assignee, due, time,
                       repeat, priority, done, doneBy, doneAt,
                       subtasks, createdBy, createdAt, order} }
  activity  { eventId: {type:'add'|'done'|'del', title, by, at} }
```

## הקבצים

| קובץ | תפקיד |
|---|---|
| `index.html` | כל האפליקציה — עיצוב, לוגיקה, Firebase |
| `manifest.webmanifest` | הופך אותה לאפליקציה שאפשר להתקין |
| `sw.js` | קאש לטעינה מהירה ולעבודה ברשת גרועה |
| `firebase-messaging-sw.js` | קליטת התראות כשהאפליקציה סגורה |
| `database.rules.json` | חוקי גישה למסד |
| `icons/` | אייקוני האפליקציה |

## הערה על אבטחה

הגישה מוגנת ב-Anonymous Auth: בלי לעבור דרך האפליקציה אי אפשר לקרוא כלום.
מי שיש לו את הקישור המלא רואה את הרשימה — וזו בדיוק הכוונה.
זו רמת ההגנה הנכונה לרשימת מטלות של זוג; אל תשמור שם דברים רגישים.
