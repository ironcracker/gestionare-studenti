# Student Management System
  Un sistem de management al studenților (Student Management System) construit ca aplicație web, care permite gestionarea studenților, a cursurilor și a înscrierilor acestora la diferite cursuri. 
  [text de afisat](www.google.com)

## Cuprins

  - Descriere
  - Tehnologii
  - Structura bazei de date
    -  Tabela students
    - Tabela courses
    - Tabela enrollments
  - Diagrama relațională
  - Instalare
  - Exemple de interogări
  - Posibile extinderi
  - Licență

## Descriere

Acest proiect reprezintă un sistem web pentru gestionarea studenților, permițând:

  - Adăugarea, editarea și ștergerea studenților

  - Administrarea cursurilor disponibile

  - Înscrierea studenților la cursuri (relație many-to-many)

  - Stocarea notelor obținute de studenți

  - Căutarea și filtrarea studenților după diferite criterii

## Tehnologii

  |Componentă | Tehnologie |
  | --------- | ---------- |
  | Backend   |     C#     |
  | Frontend  |   React    |
  | Baza de date |  MySQL  | 

## Structura bazei de date
  Baza de date este formată din 3 tabele principale, conectate prin relații de tip one-to-many și many-to-many

  ### 1. Tabela students

  Stochează informațiile personale ale studenților.
  | Coloană	| Tip |	Constrângeri | Descriere |
  | ------- | --- | ------------ | --------- |
  | id      |	INT |	PRIMARY KEY, AUTO_INCREMENT |	Identificator unic |
  | first_name |	VARCHAR(50) |	NOT NULL |	Prenumele studentului |
  | last_name	| VARCHAR(50) |	NOT NULL	| Numele de familie |
  | email |	VARCHAR(100) |	NOT NULL, UNIQUE |	Adresa de email (unică) |
  gender |	ENUM('M','F')	| NOT NULL |	Sexul studentului |

```sql
CREATE TABLE students (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(50)  NOT NULL,
  last_name   VARCHAR(50)  NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  gender      ENUM('M','F') NOT NULL,
);
```

### 2. Tabela courses
  Stochează informațiile despre cursurile disponibile.

  | Coloană	| Tip |	Constrângeri | Descriere |
  | ------- | --- | ------------ | --------- |
  |    id   |	INT	| PRIMARY KEY, AUTO_INCREMENT |	Identificator unic|
  | course_code| 	VARCHAR(20)|	NOT NULL, UNIQUE| 	Codul cursului (ex: CS101)|
  |course_name |	VARCHAR(100) |	NOT NULL |	Denumirea cursului|
  |credits | INT	| DEFAULT 3	|Numărul de credite|

```sql
CREATE TABLE courses (
    id          INT AUTO_INCREMENT PRIMARYKEY,
    course_code VARCHAR(20)  NOT NULL UNIQUE,
    course_name VARCHAR(100) NOT NULL,
    credits     INT DEFAULT 3
);
```

### 3. Tabela enrollments
  Tabelă de legătură (junction table) care rezolvă relația many-to-many dintre studenți și cursuri.

| Coloană	| Tip |	Constrângeri | Descriere |
| ------- | --- | ------------ | --------- |
|id	| INT	|PRIMARY KEY, AUTO_INCREMENT|	Identificator unic|
  |student_id	|INT|	FOREIGN KEY → students(id)|	Referință către student|
  |course_id|	INT|	FOREIGN KEY → courses(id)	|Referință către curs|
  |grade|	VARCHAR(2)|	NULL	| Nota obținută (opțional)|
```sql
CREATE TABLE enrollments (
    id          INT AUTO_INCREMENT PRIMARYKEY,
    student_id  INT NOT NULL,
    course_id   INT NOT NULL,
    grade       VARCHAR(2),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment(student_id, course_id)
);
```

## Diagrama relațională

  ```mermaid
erDiagram
    STUDENTS ||--o{ ENROLLMENTS : ""
    COURSES  ||--o{ ENROLLMENTS : ""

    STUDENTS {
        int id PK
        varchar first_name
        varchar last_name
        varchar email UK
        enum gender
    }

    COURSES {
        int id PK
        varchar course_code UK
        varchar course_name
        int credits
    }

    ENROLLMENTS {
        int id PK
        int student_id FK
        int course_id FK
        varchar grade
    }
``` 

### Relații:

  - Un student poate fi înscris la mai multe cursuri (1 → N prin enrollments)

  - Un curs poate avea mai mulți studenți înscriși (1 → N prin enrollments)

  - enrollments creează o relație many-to-many între students și courses

## Instalare

  1. Clonează repository-ul:
  ```bash

    git clone https://github.com/ironcracker/gestionare-studenti.git
    cd gestionare-studenti
  ```

  2. Creează baza de date:
  ```sql
    CREATE DATABASE student_management;
    USE student_management;
  ```
  3. Rulează scriptul SQL pentru a crea tabelele (vezi secțiunea Structura bazei de date).

  4. Configurează conexiunea la baza de date în fișierul .env:
  ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=parola_ta
    DB_NAME=student_management
  ```
  5. Instalează dependențele și pornește aplicația:
  ```bash
    npm install
    npm start
  ```
  6. Accesează aplicația la http://localhost:5173/gestionare-studenti/.

## Posibile extinderi

  - Adăugarea de câmpuri suplimentare în students: date_of_birth, phone, address

  - Crearea unei tabele instructors și legarea acesteia de courses

  - Adăugarea de coloane semester și year în enrollments pentru urmărirea istoricului

  - Modul de raportare și statistici (medii, promovabilitate)

  - Sistem de autentificare cu roluri (admin, profesor, student)

  - Interfață separată pentru elevi cu access doar la propriile note nu și ale colegilor

## Licență

  Acest proiect este licențiat sub MIT License. Vezi fișierul LICENSE pentru detalii.

  Autor: Logojan Nicolae Bogdan 

  Contact: nicolae.logojan@student.upt.ro
