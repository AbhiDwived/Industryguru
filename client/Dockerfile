# Static nginx approach - no build step
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy pre-built static files
COPY dist/ /usr/share/nginx/html/

# Create nginx configuration for SPA
RUN echo 'server { \
    listen 3000 default_server; \
    listen [::]:3000 default_server; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf.dpkg-dist 2>/dev/null || true

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]