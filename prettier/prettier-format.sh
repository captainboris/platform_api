#!/bin/bash

echo "Checking code format based on .prettierrc rules..."

# Gather all staged .ts and .tsx files in src and test directories
FILES_TO_FORMAT=$(git diff --cached --name-only --diff-filter=d | grep -E "^(src|test)/.*\.(ts|tsx)$")

if [[ -n "$FILES_TO_FORMAT" ]]; then
    echo "Code format issues detected:"
    echo "Files that need formatting:"
    echo "#########################"
    echo "$FILES_TO_FORMAT"
    echo "#########################"

    for file in $FILES_TO_FORMAT; do
        # Temporarily save the current state of the file for comparison after formatting
        git diff --cached --quiet -- "$file"
        PRE_FORMAT_HASH=$(git hash-object "$file")

        echo "Formatting file: $file"
        yarn prettier --write --config ./prettier/.prettierrc "$file"

         # Compare the state of the file after formatting to determine if changes occurred
        POST_FORMAT_HASH=$(git hash-object "$file")
        if [ "$PRE_FORMAT_HASH" != "$POST_FORMAT_HASH" ]; then
            git add "$file"
            echo "$file has been reformatted and re-staged."
        else
            echo "$file was checked but did not require reformatting."
        fi
    done

    echo "Format issues have been checked and necessary files re-staged. Proceeding with commit."
else
    echo "All files are properly formatted."
fi
