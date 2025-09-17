# ETG Scripts

A minimal, professional internal script portal for customer support agents. Purpose-built to deliver fast, consistent responses with lightweight editing, per-line copy, and simple personalization.

---

## Live
https://chat-app-cep.vercel.app/scripts/etg

---

## Purpose
Provide agents with a concise, reliable library of categorized response scripts so they can handle conversations quickly and consistently while preserving canonical content.

---

## Key Features
- **Categorized script library** with searchable titles and tags  
- **Per-bullet copy** and **copy full script** actions with clipboard confirmation  
- **Placeholder replacement** for agent and customer names before copying  
- **Starred scripts** and **recent scripts** for fast access  
- **Editable preview** that preserves original scripts as read-only canonical entries  
- **Light and dark themes** with accessible controls

---

## Tech Stack
- **Frontend**: React and TypeScript  
- **Styling**: Tailwind CSS  
- **Hosting**: Vercel  
- **Data**: Local JSON or lightweight CMS (configurable)

---

## Quick Start for Developers
1. Clone the repository.  
2. Install dependencies: `npm install` or `pnpm install`.  
3. Create environment variables from `.env.example`.  
4. Run the app: `npm run dev` or `pnpm dev`.  
5. Open: `http://localhost:3000/scripts/etg`.

---

## Required Environment Variables
- **NEXT_PUBLIC_APP_NAME** — Application display name  
- **NEXT_PUBLIC_API_BASE** — API base path if using a backend  
- Authentication keys or SSO variables if access control is enabled

---

## Agent Usage
- Open the ETG Scripts page after signing in.  
- Use the search bar or tags to locate a script.  
- Click a script to preview and edit a local copy.  
- Replace placeholders using the inline personalize controls.  
- Use per-bullet buttons for precise copying or copy the full script.  
- Star frequently used scripts to pin them in the UI.

---

## Developer Notes
- Store scripts as compact JSON objects: id, title, category, tags, lines[], notes, lastEditedBy, lastEditedAt.  
- Implement clipboard interactions using the browser Clipboard API and show brief toasts for confirmation.  
- Keep canonical scripts read-only; edits create editable local copies to prevent accidental overwrites.  
- Prioritize keyboard accessibility for search, copy, and personalization actions.

---

## Contributing
- Open focused pull requests that implement one change at a time.  
- Follow existing styling tokens and accessibility patterns.  
- Include tests for clipboard and placeholder replacement logic when applicable.

---

## Roadmap
- Basic usage metrics and top scripts panel  
- Simple version note showing last editor and date  
- Per-script feedback flag for maintainers

---

## License

Open source [Don't make any changes without approval]

---

## Contact
For issues or suggestions, open an issue in the repository or contact the maintainer Shivam via team channels.


Made with ❤️ by Shivam.