package main

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type loginData struct {
	User       int
	Password   string
	NomUsuario string
	Correo     string
}

var templates = template.Must(template.ParseFiles("../../tmpl/game.html", "../../tmpl/speak.html", "../../tmpl/index.html", "../../tmpl/about.html", "../../tmpl/faq.html", "../../tmpl/juego.html", "../../tmpl/blank.html", "../../tmpl/login.html", "../../tmpl/register.html", "../../tmpl/config.html"))
var db, err = sql.Open("mysql", "admin:hola123@/4blind")
var usuarioActual loginData

func main() {
	r := createRouter()
	//http.HandleFunc("/speak/", speaking)
	//http.Handle("/", http.FileServer(http.Dir("../../")))
	if err != nil {
		log.Fatal("Hubo un error: ", err)
	} else {
		println("Connected to MySQL")
	}
	log.Fatal(http.ListenAndServe(":8080", r))
}

func createRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/login/", loginf)
	r.HandleFunc("/register/", registerf)
	r.HandleFunc("/registered", getregistered).Methods("POST")
	r.HandleFunc("/index/", indexf)
	r.HandleFunc("/juego/", juegof)
	r.HandleFunc("/about/", aboutf)
	r.HandleFunc("/config/", configf)
	r.HandleFunc("/faq/", faqf)
	staticFileDirectory := http.Dir("../../")
	staticFileHandler := http.StripPrefix("/", http.FileServer(staticFileDirectory))
	r.PathPrefix("/").Handler(staticFileHandler).Methods("GET")
	return r
}

func renderTemplate(w http.ResponseWriter, tmpl string, data *loginData) {
	err := templates.ExecuteTemplate(w, tmpl+".html", data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func logIn(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "login", nil)
}

func playGame(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "game", nil)
}

func speaking(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "speak", nil)
}

func indexf(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "index", nil)
}

func loginf(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "login", nil)
}

func configf(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "config", nil)
}

func registerf(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "register", nil)
}

func getregistered(w http.ResponseWriter, r *http.Request) {
	nomUsuario := r.FormValue("nombre")
	correo := r.FormValue("email")
	pass := r.FormValue("pass")
	query, err := db.Prepare("INSERT INTO loginData(nomUsuario, correo, contra) values(?, ?, ?)")
	if err != nil {
		println(err)
	}
	query.Exec(nomUsuario, correo, pass)
	http.Redirect(w, r, "/login/", http.StatusSeeOther)
}

func aboutf(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "about", nil)
}

func juegof(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "juego", nil)
}

func faqf(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "faq", nil)
}
