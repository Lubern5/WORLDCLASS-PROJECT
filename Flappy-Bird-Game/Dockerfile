FROM httpd:2.4-alpine

# Install git
RUN apk --update --no-cache add git

# Set the working directory
WORKDIR /usr/local/apache2/htdocs/

# Remove existing files and directories
RUN rm -rf ./*

# Clone the repository
RUN git clone https://github.com/kaizhelam/Flappy-Bird-Game.git .

# Allow Apache to access the directories
RUN echo "Require all granted" > /usr/local/apache2/htdocs/.htaccess

# Expose port 80
EXPOSE 80
