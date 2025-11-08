@echo off
echo ============================================
echo   Cleaning Git history for Twilio secrets
echo ============================================

:: Step 1: Make sure git-filter-repo is installed
pip show git-filter-repo >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing git-filter-repo...
    pip install git-filter-repo
)

:: Step 2: Run cleanup to remove the file from history
echo Removing old twilio_config.py history...
git filter-repo --path function_hall_backend/app/twilio_config.py --invert-paths

:: Step 3: Expire old reflogs and clean up
echo Cleaning git objects...
git reflog expire --expire=now --all
git gc --prune=now --aggressive

:: Step 4: Force push to remote
echo Force pushing cleaned branch to GitHub...
git push origin customer --force

echo ============================================
echo Cleanup complete! Push should now be accepted.
echo ============================================
pause
