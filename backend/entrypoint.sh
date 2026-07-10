#!/bin/sh

# Ожидание поднятия MySQL
echo "Waiting for database..."
while ! mysqladmin ping -h"db" -uroot -proot --silent; do
    sleep 2
done

# Копируем .env если его нет
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Установка зависимостей
composer install --no-interaction

# Генерация ключа (не ломает существующий, так как это dev)
php artisan key:generate

# Миграции и сиды
php artisan migrate:fresh --seed --force

# Генерация документации swagger
php artisan l5-swagger:generate

echo "Starting PHP Artisan Serve..."
php artisan serve --host=0.0.0.0 --port=8000
