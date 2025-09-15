@echo off
cd "E:\Progetto\Progetti\APP\Skemino prova"
git add .
git commit -m "fix(ui): resolve board cell gradient display issue with CSS specificity and invalid Tailwind class"
git push origin main
echo Commit completed successfully!