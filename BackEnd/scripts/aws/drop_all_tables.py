#!/usr/bin/env python3
"""
Script para conectarse a MySQL en AWS y borrar todas las tablas
"""

import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def connect_to_mysql():
    """Conecta a la base de datos MySQL en AWS"""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=int(os.getenv('DB_PORT', 3306))
        )
        
        if connection.is_connected():
            print("Conexión exitosa a MySQL")
            return connection
            
    except Error as e:
        print(f"Error al conectar con MySQL: {e}")
        return None

def get_all_tables(connection):
    """Obtiene lista de todas las tablas en la base de datos"""
    cursor = connection.cursor()
    cursor.execute("SHOW TABLES")
    tables = [table[0] for table in cursor.fetchall()]
    cursor.close()
    return tables

def drop_all_tables(connection):
    """Borra todas las tablas de la base de datos"""
    try:
        cursor = connection.cursor()
        
        # Desactivar verificaciones de foreign key temporalmente
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        
        # Obtener todas las tablas
        tables = get_all_tables(connection)
        
        if not tables:
            print("No se encontraron tablas para borrar")
            return
        
        print(f"Se encontraron {len(tables)} tablas:")
        for table in tables:
            print(f"  - {table}")
        
        # Borrar todas las tablas
        for table in tables:
            try:
                cursor.execute(f"DROP TABLE {table}")
                print(f"Tabla '{table}' eliminada exitosamente")
            except Error as e:
                print(f"Error al eliminar tabla '{table}': {e}")
        
        # Reactivar verificaciones de foreign key
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        
        print("\nProceso completado")
        
    except Error as e:
        print(f"Error durante el proceso: {e}")
    finally:
        cursor.close()

def main():
    """Función principal"""
    print("Conectando a MySQL en AWS...")
    
    connection = connect_to_mysql()
    if not connection:
        return
    
    try:
        drop_all_tables(connection)
    finally:
        if connection.is_connected():
            connection.close()
            print("Conexión cerrada")

if __name__ == "__main__":
    main()