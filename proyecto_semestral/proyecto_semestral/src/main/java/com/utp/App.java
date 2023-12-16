package com.utp;

import static spark.Spark.*;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

class Piramides {
    ArrayList<JSONObject> piramides = new ArrayList<JSONObject>();

    public JSONArray mostrarPiramides() {
        JSONArray arrg = new JSONArray();
        for (int i = 0; i < piramides.size(); i++) {
            JSONObject obj = new JSONObject();
            obj.put("id", i);
            obj.put("fila", piramides.get(i));
            arrg.put(obj);
        }
        return arrg;
    }

    public JSONObject obtenerPiramide(int id) {
        JSONObject json = new JSONObject();
        json.put("id", id);
        json.put("value", piramides.get(id));
        return json;
    }

    public void agregarPiramide(JSONObject value) {
        piramides.add(value);
    }
}

public class App {
    public static void main(String[] args) {

        staticFiles.location("/public");
        Piramides pir = new Piramides();

        // Aqui mostramos todos los datos
        get("/piramides", (req, res) -> {
            return pir.mostrarPiramides();
        });

        // Aqui consultamos datos por su id
        get("/piramide/:id", (req, res) -> {
            int id = Integer.parseInt(req.params("id"));
            return pir.obtenerPiramide(id);
        });

        // Aqui insertamos datos
        post("/piramide", (req, res) -> {
            JSONObject json = new JSONObject(req.body());
            pir.agregarPiramide(json);
            // Aqui lo mostramos
            return json;
        });

    }
}