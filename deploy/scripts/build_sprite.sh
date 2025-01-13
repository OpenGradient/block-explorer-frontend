#!/bin/bash

yarn icons build -i ./icons -o ./public/icons --optimize

# Skip hash creation and renaming for playwright environment
if [ "$NEXT_PUBLIC_APP_ENV" != "pw" ]; then
    # Generate hash from the sprite file
    # HASH=$(md5sum ./public/icons/sprite.svg | cut -d' ' -f1 | head -c 8)

    # Try md5sum first, fall back to md5 if not available
    if command -v md5sum >/dev/null 2>&1; then
        HASH=$(md5sum ./public/icons/sprite.svg | cut -d' ' -f1 | head -c 8)
    else
        HASH=$(md5 -q ./public/icons/sprite.svg | head -c 8)
    fi

    # Remove old sprite files
    rm -f ./public/icons/sprite.*.svg

    # Rename the new sprite file
    mv ./public/icons/sprite.svg "./public/icons/sprite.${HASH}.svg"

    export NEXT_PUBLIC_ICON_SPRITE_HASH=${HASH}

    echo "SVG sprite created: sprite.${HASH}.svg"
else
    echo "SVG sprite created: sprite.svg (hash skipped for playwright environment)"
fi