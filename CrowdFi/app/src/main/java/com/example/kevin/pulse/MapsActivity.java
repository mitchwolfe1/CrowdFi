package com.example.kevin.pulse;

import android.content.Intent;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    private HashMap<String, LatLng> tRPIMap;
    private Button tBackButton, tServerButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);

        tBackButton = findViewById(R.id.tBackButton);
        tServerButton = findViewById(R.id.tServerButton);

        setUpBackButton();
        setUpServerButton();

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        Bundle bundle = this.getIntent().getExtras();
        if (bundle != null)
        {
            tRPIMap = (HashMap)bundle.getSerializable("key");
        }
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }


    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        String a ="";

        // Add a marker in Sydney and move the camera
        for (String s : tRPIMap.keySet())
        {
            mMap.addMarker(new MarkerOptions().position(tRPIMap.get(s)).title(s));
            a = s;
        }
        mMap.moveCamera(CameraUpdateFactory.newLatLng(tRPIMap.get(a)));
    }
    private void setUpServerButton()
    {
        tServerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new Thread(new Runnable() {
                    public void run() {
                        try
                        {
                            for (String s : tRPIMap.keySet()) {
                                LatLng a = tRPIMap.get(s);
                                s = s.replaceAll("\\s","");
                                URL url = new URL("http://crowdfi.net/redisapi.php?lat=" + a.latitude + "&lon=" + a.longitude + "&id="+s);
                                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                                connection.setRequestMethod("GET");
                                connection.setRequestProperty("charset", "utf-8");
                                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                                String inputLine;
                                StringBuffer response = new StringBuffer();

                                while ((inputLine = in.readLine()) != null) {
                                    response.append(inputLine);
                                }
                                in.close();
                            }

                            //print result
                            //System.out.println(response.toString());




                        }
                        catch (Exception e)
                        {
                            e.printStackTrace();
                        }
                    }
                }).start();

            }
        });
    }
    private void setUpBackButton()
    {
        final Intent i = new Intent(this, HomeScreenActivity.class);
        tBackButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(i);
            }
        });
    }
}
