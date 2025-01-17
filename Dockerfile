FROM node:21-alpine AS node

RUN apk update \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
    && apk add --no-cache \
        libstdc++ \
        libgcc \
        git \
        bash \
        zsh \
        libxml2-dev \
        libzip-dev \
        libmcrypt-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        libxml2-dev \
        icu-dev \
        autoconf \
        rabbitmq-c-dev \
        libxslt-dev \
        postgresql-dev \
    && apk add --update \
        linux-headers \
    && rm -rf /tmp/* /var/cache/apk/* \
    && apk del .build-deps

RUN wget https://github.com/robbyrussell/oh-my-zsh/raw/65a1e4edbe678cdac37ad96ca4bc4f6d77e27adf/tools/install.sh -O - | zsh
RUN echo 'export ZSH=/home/docker/.oh-my-zsh' > ~/.zshrc \
    && echo 'ZSH_THEME="simple"' >> ~/.zshrc \
    && echo 'source $ZSH/oh-my-zsh.sh' >> ~/.zshrc \
    && echo 'PROMPT="%{$fg_bold[yellow]%}php:%{$fg_bold[blue]%}%(!.%1~.%~)%{$reset_color%} "' > ~/.oh-my-zsh/themes/simple.zsh-theme

WORKDIR /srv/app

ENTRYPOINT ["tail", "-f", "/dev/null"]
