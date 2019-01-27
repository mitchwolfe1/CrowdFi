package com.example.kevin.pulse;

import android.Manifest;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.maps.model.LatLng;

import java.util.HashMap;

public class HomeScreenActivity extends AppCompatActivity {
    private LocationManager tLocationManager;
    private LocationListener tLocationListener;
    private String tLocationProvider;
    private Button tStartButton, tStopButton, tMapButton;
    private TextView tRPIText;
    private Spinner tSpinner;
    private String tSelectedRPI;
    private HashMap<String, LatLng> tRPIMap;
    private static final int MY_PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION = 11;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.homescreen);

        tRPIText = findViewById(R.id.tRPIText);
        tStartButton = findViewById(R.id.tRPIAddButton);
        tStopButton = findViewById(R.id.tRPIRemoveButton);
        tMapButton = findViewById(R.id.tMapButton);
        tSpinner =  findViewById(R.id.tSpinner);

        tLocationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        tRPIMap = new HashMap<>();

        setUpSpinner();
        setUpLocationListener();
        setUpStartButtonListener();
        setUpStopButtonListener();
        setUpMapButtonListener();

        if (!isLocationEnabled())
        {
            showAlert();
        }
        tLocationProvider = LocationManager.NETWORK_PROVIDER;
    }


    private boolean isLocationEnabled() {
        return tLocationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
                tLocationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

    }
    private void showAlert() {
        final AlertDialog.Builder dialog = new AlertDialog.Builder(this);
        dialog.setTitle("Enable Location")
                .setMessage("Your Locations Settings is set to 'Off'.\nPlease Enable Location to " +
                        "use this app")
                .setPositiveButton("Location Settings", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface paramDialogInterface, int paramInt) {
                        Intent myIntent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                        startActivity(myIntent);
                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface paramDialogInterface, int paramInt) {
                    }
                });
        dialog.show();
    }
    public void setUpStartButtonListener()
    {
        tStartButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (ContextCompat.checkSelfPermission(HomeScreenActivity.this,
                        Manifest.permission.ACCESS_FINE_LOCATION)
                        != PackageManager.PERMISSION_GRANTED) {

                    // Permission is not granted
                    // Should we show an explanation?
                    if (ActivityCompat.shouldShowRequestPermissionRationale(HomeScreenActivity.this,
                            Manifest.permission.ACCESS_FINE_LOCATION)) {
                        // Show an explanation to the user *asynchronously* -- don't block
                        // this thread waiting for the user's response! After the user
                        // sees the explanation, try again to request the permission.
                    } else {
                        // No explanation needed; request the permission
                        ActivityCompat.requestPermissions(HomeScreenActivity.this,
                                new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                                MY_PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION);

                        // MY_PERMISSIONS_REQUEST_READ_CONTACTS is an
                        // app-defined int constant. The callback method gets the
                        // result of the request.
                    }
                } else {
                    tLocationManager.requestLocationUpdates(tLocationProvider, 0,0,tLocationListener);


                }


        }});

    }
    private void setUpStopButtonListener()
    {
        tStopButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                tLocationManager.removeUpdates(tLocationListener);
                tRPIMap.remove(tLocationProvider);
                Toast.makeText(HomeScreenActivity.this,"Purged " + tSelectedRPI, Toast.LENGTH_SHORT).show();
            }
        });
    }
    /*
    Sets up location listener, does not actually start listening for location updates.
     */
    private void setUpLocationListener()
    {
        tLocationListener = new LocationListener() {
            public void onLocationChanged(Location location) {
                //if the location hasn't changed since the last pi
                if (tRPIMap.get(tSelectedRPI) != null) {
                    if (tRPIMap.get(tSelectedRPI).latitude == location.getLatitude() && tRPIMap.get(tSelectedRPI).longitude == location.getLongitude())
                    {
                        tLocationManager.removeUpdates(tLocationListener);
                    }
                }
                else {
                    tRPIMap.put(tSelectedRPI, new LatLng(location.getLatitude(), location.getLongitude()));
                    Toast.makeText(HomeScreenActivity.this, "Initialized " + tSelectedRPI, Toast.LENGTH_SHORT).show();
                }
            }

            public void onStatusChanged(String provider, int status, Bundle extras) {}

            public void onProviderEnabled(String provider) {}

            public void onProviderDisabled(String provider) {}
        };

    }
    private void setUpMapButtonListener()
    {
        final Intent intent = new Intent(this, MapsActivity.class);

        tMapButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Bundle extras = new Bundle();
                extras.putSerializable("key", tRPIMap);
                intent.putExtras(extras);
                startActivity(intent);


            }
        });

    }
    private void setUpSpinner()
    {
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this, R.array.RPI_Array, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        tSpinner.setAdapter(adapter);

        AdapterView.OnItemSelectedListener listener = new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                tSelectedRPI = parent.getItemAtPosition(position).toString();
                tRPIText.setText(tSelectedRPI);

            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {


            }
        };
        tSpinner.setOnItemSelectedListener(listener);
    }
    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
        switch (requestCode) {
            case MY_PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    tLocationManager.requestLocationUpdates(tLocationProvider, 0,0,tLocationListener);
                    // contacts-related task you need to do.
                } else {
                    // permission denied, boo! Disable the
                    // functionality that depends on this permission.
                }
                return;
            }

            // other 'case' lines to check for other
            // permissions this app might request.
        }
    }


}

