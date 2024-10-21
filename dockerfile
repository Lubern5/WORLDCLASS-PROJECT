FROM httpd:2.4-alpine

# Install git
RUN apk --update --no-cache add git

# Set the working directory
WORKDIR /usr/local/apache2/htdocs/

# Remove existing files and directories
RUN rm -rf ./*

# Clone the repository
RUN git clone https://github.com/Lubern5/aws-cloud-resume.git .

# Create an .htaccess file to hide indexes and specific files
RUN echo "Options -Indexes" > .htaccess && \
    echo "IndexIgnore .DS_Store .git/ img/ infra/ lambda-function/ newgym/ pro-site/ website/" >> .htaccess

# Allow Apache to access the directories
RUN echo "Require all granted" > /usr/local/apache2/htdocs/.htaccess

# Expose port 80
EXPOSE 80

# Copy each application to the Apache document root
COPY ./text-to-speech-converter/ /usr/local/apache2/htdocs/text-to-speech-converter/
COPY ./Lu-Portfolio-Website/ /usr/local/apache2/htdocs/Lu-Portfolio-Website/
COPY ./Weddingwebsite/ /usr/local/apache2/htdocs/newgym/
COPY ./Lu-Portfolio-Website/ /usr/local/apache2/htdocs/Lu-Portfolio-Website/
COPY ./website/ /usr/local/apache2/htdocs/website/
COPY ./portfolio-site-html-css/ /usr/local/apache2/htdocs/website/
COPY ./Flappy-Bird-Game/ /usr/local/apache2/htdocs/website/
COPY ./2048/ /usr/local/apache2/htdocs/website/
COPY ./3D-Night-Driving-Car/ /usr/local/apache2/htdocs/website/