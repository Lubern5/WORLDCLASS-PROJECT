FROM httpd:2.4-alpine

# Install git and clean up
RUN apk --update --no-cache add git

# Set the working directory
WORKDIR /usr/local/apache2/htdocs/

# Remove existing files, clone the repository, and create .htaccess
RUN rm -rf ./* && \
    git clone https://github.com/Lubern5/WORLDCLASS-PROJECT.git . && \
    echo "Options -Indexes" > .htaccess && \
    echo "IndexIgnore .DS_Store .git/ img/ infra/ lambda-function/ newgym/ pro-site/ website/" >> .htaccess && \
    echo "Require all granted" >> .htaccess

# Expose port 80
EXPOSE 80

# Copy applications to the Apache document root
COPY ./text-to-speech-converter/ /usr/local/apache2/htdocs/text-to-speech-converter/
COPY ./Lu-page/ /usr/local/apache2/htdocs/Lu-Portfolio-Website/
COPY ./Weddingwebsite/ /usr/local/apache2/htdocs/Weddingwebsite/
COPY ./Lu-Portfolio-Website/ /usr/local/apache2/htdocs/Lu-Portfolio-Website/
COPY ./website/ /usr/local/apache2/htdocs/website/
COPY ./LuReBuild/ /usr/local/apache2/htdocs/LuReBuild/
COPY ./images/ /usr/local/apache2/htdocs/images/
COPY ./Flappy-Bird-Game/ /usr/local/apache2/htdocs/Flappy-Bird-Game/
COPY ./2048/ /usr/local/apache2/htdocs/website/
COPY ./3D-Night-Driving-Car/ /usr/local/apache2/htdocs/3D-Night-Driving-Car/
