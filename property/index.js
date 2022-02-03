// Helper class for number and string formatting
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Extracting URL parameter in the QueryString object
var QueryString = (function() {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], pair[1]];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
})();

// IE8 and below
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun, scope) {
    var T = this,
      A = [],
      i = 0,
      itm,
      L = T.length;
    if (typeof fun == "function") {
      while (i < L) {
        if (i in T) {
          itm = T[i];
          if (fun.call(scope, itm, i, T)) A[A.length] = itm;
        }
        ++i;
      }
    }
    return A;
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(elt /*, from*/) {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = from < 0 ? Math.ceil(from) : Math.floor(from);
    if (from < 0) from += len;

    for (; from < len; from++) {
      if (from in this && this[from] === elt) return from;
    }
    return -1;
  };
}

// Comparison functions for dates
function compareDateStr(a, b) {
  var a_date = new Date(a);
  var b_date = new Date(b);

  if (a_date < b_date) return -1;
  else return 1;
}

// Object with all LGA codes and corresponding names
var vic_lgas = {
  "300": "ALPINE",
  "301": "ARARAT",
  "302": "BALLARAT",
  "303": "BANYULE",
  "304": "BASS COAST",
  "305": "BAW BAW",
  "306": "BAYSIDE",
  "307": "BOROONDARA",
  "308": "BRIMBANK",
  "309": "BULOKE",
  "310": "CAMPASPE",
  "311": "CARDINIA",
  "312": "CASEY",
  "313": "CENTRAL GOLDFIELDS",
  "314": "COLAC OTWAY",
  "315": "CORANGAMITE",
  "316": "DAREBIN",
  "319": "EAST GIPPSLAND",
  "320": "FRANKSTON",
  "321": "GANNAWARRA",
  "322": "GLEN EIRA",
  "323": "GLENELG",
  "324": "GOLDEN PLAINS",
  "325": "GREATER BENDIGO",
  "326": "GREATER DANDENONG",
  "327": "GREATER GEELONG",
  "328": "GREATER SHEPPARTON",
  "329": "HEPBURN",
  "330": "HINDMARSH",
  "331": "HOBSONS BAY",
  "332": "HORSHAM",
  "333": "HUME",
  "334": "INDIGO",
  "335": "KINGSTON",
  "336": "KNOX",
  "337": "LATROBE",
  "338": "LODDON",
  "339": "MACEDON RANGES",
  "340": "MANNINGHAM",
  "341": "MARIBYRNONG",
  "342": "MAROONDAH",
  "343": "MELBOURNE",
  "344": "MELTON",
  "345": "MILDURA",
  "346": "MITCHELL",
  "347": "MOIRA",
  "348": "MONASH",
  "349": "MOONEE VALLEY",
  "350": "MOORABOOL",
  "351": "MORELAND",
  "352": "MORNINGTON PENINSULA",
  "353": "MOUNT ALEXANDER",
  "354": "MOYNE",
  "355": "MURRINDINDI",
  "356": "NILLUMBIK",
  "357": "NORTHERN GRAMPIANS",
  "358": "PORT PHILLIP",
  "359": "PYRENEES",
  "360": "QUEENSCLIFFE",
  "361": "SOUTH GIPPSLAND",
  "362": "SOUTHERN GRAMPIANS",
  "363": "STONNINGTON",
  "364": "STRATHBOGIE",
  "365": "SURF COAST",
  "366": "SWAN HILL",
  "367": "TOWONG",
  "368": "WANGARATTA",
  "369": "WARRNAMBOOL",
  "370": "WELLINGTON",
  "371": "WEST WIMMERA",
  "372": "WHITEHORSE",
  "373": "WHITTLESEA",
  "374": "WODONGA",
  "375": "WYNDHAM",
  "376": "YARRA",
  "377": "YARRA RANGES",
  "378": "YARRIAMBIACK",
  "379": "FRENCH-ELIZABETH-SANDSTONE ISLANDS (UNINC)",
  "381": "BENALLA",
  "382": "MANSFIELD",
  "383": "MOUNT BAW BAW ALPINE RESORT (UNINC)",
  "384": "MOUNT BULLER ALPINE RESORT (UNINC)",
  "385": "LAKE MOUNTAIN ALPINE RESORT (UNINC)",
  "386": "FALLS CREEK ALPINE RESORT (UNINC)",
  "387": "MOUNT STIRLING ALPINE RESORT (UNINC)",
  "388": "MOUNT HOTHAM ALPINE RESORT (UNINC)",
  "389": "GABO ISLAND (UNINC)"
};

var d_prop, d_addr;

$(function() {
  // Message depending on browser
  var browserDiffedMsg =
    "<h2>Drop your statistics file (.json)</h2><p>Or click here to <em>Browse</em>..</p>";
  if (!window.FileReader) {
    browserDiffedMsg =
      "<h2>Click here to <em>Browse</em> to your statistics file (.json)</h2>";
  }
  $("#zone").append(browserDiffedMsg);

  // Tell FileDrop we can deal with iframe uploads using this URL:
  var options = { iframe: { url: "../FileDrop/upload.php" } };
  // Attach FileDrop to an area ('zone' is an ID but you can also give a DOM node):
  var zone = new FileDrop("zone", options);

  // Do something when a user chooses or drops a file:
  zone.event("send", function(files) {
    // Depending on browser support files (FileList) might contain multiple items.
    files.each(function(file) {
      // React on successful AJAX upload:
      file.event("done", function(xhr) {
        // 'this' here points to fd.File instance that has triggered the event.
        //alert('Done uploading ' + this.name + ', response:\n\n' + xhr.responseText);
        processUploadResponse(xhr.responseText);
      });

      // Send the file:
      file.sendTo("../FileDrop/upload.php");
    });
  });

  // React on successful iframe fallback upload (this is separate mechanism
  // from proper AJAX upload hence another handler):
  zone.event("iframeDone", function(xhr) {
    //alert('Done uploading via <iframe>, response:\n\n' + xhr.responseText);
    processUploadResponse(xhr.responseText);
  });

  var processUploadResponse = function(xhrresponsetext) {
    var file = JSON.parse(xhrresponsetext);
    if (file.url) {
      // Layout update on successful upload
      $("<p/>")
        .text("File successfully uploaded.")
        .appendTo($("#step1"));

      var filename = file.url
        .split("/")
        .pop()
        .split(".")[0];

      // Adding the PDF link
      // (not needed anymore since we use a JS only option for PDF generation)
      // $("#pdf_link").attr("href", "../ws/createpdf.php?file=" + filename);

      $("#step1").hide();
      $("#step2").removeClass("hidden");

      var urlActualDomain = file.url.replace(
        "http://ec2-54-79-28-10.ap-southeast-2.compute.amazonaws.com",
        window.location.origin
      );
      // Extraction of the content just uploaded
      $.getJSON(urlActualDomain, function(json) {
        // Do something with the JSON content
        var jf = json.features;

        // Get distinct dates:
        var dt = $.map(jf, function(v, k) {
          return v.properties.stat_date;
        })
          .filter(function(itm, i, a) {
            return i == a.indexOf(itm);
          })
          .sort(compareDateStr);

        // Remapped data array (grouped by date)
        d = [];
        for (var i = 0; i < dt.length; i++) {
          var d_obj = {
            date: dt[i].replace(/\//g, "-").replace(" 00:00:00", "")
          };
          // Direct properties
          for (var k = 0; k < jf.length; k++) {
            if (jf[k].properties.stat_date == dt[i]) {
              d_obj[jf[k].properties.stat_metric] = jf[k].properties.stat_value;
            }
          }

          // Calculated properties
          if (d_obj["council_properties"] && d_obj["council_properties"] != 0) {
            if (d_obj["council_properties_in_vicmap"]) {
              d_obj["match_rate_property"] =
                Math.round(
                  (d_obj["council_properties_in_vicmap"] /
                    d_obj["council_properties"]) *
                    100 *
                    10
                ) / 10;
            }
            if (d_obj["council_address_in_vicmap"]) {
              d_obj["match_rate_address"] =
                Math.round(
                  (d_obj["council_address_in_vicmap"] /
                    d_obj["council_properties"]) *
                    100 *
                    10
                ) / 10;
            }
          }

          d.push(d_obj);
        }
        //d.reverse();
        console.log(d);

        // Title update
        $("#id_site").html(toTitleCase(vic_lgas[file.lga_code]));

        // Current section
        $("#date_current").html(d[d.length - 1].date);
        $("#metric_current").html(
          d[d.length - 1].match_rate_property.toFixed(1)
        );
        $("#metric1_current").html(
          numberWithCommas(d[d.length - 1].council_properties_not_in_vicmap)
        );
        $("#metric2_current").html(
          numberWithCommas(d[d.length - 1].vicmap_parcels_no_propnum)
        );
        $("#metric3_current").html(
          numberWithCommas(d[d.length - 1].vicmap_propnum_not_in_council)
        );

        // All latest metrics
        $.each(d[d.length - 1], function(index, value) {
          $("#table_metrics").append(
            "<tr><td>" + index + "</td><td>" + value + "</td></tr>"
          );
        });

        // Data property:
        d_prop = $.grep(d, function(n, i) {
          return !!n["match_rate_property"];
        });
        d_addr = $.grep(d, function(n, i) {
          return !!n["match_rate_address"];
        });

        // Chart rebuild on resize
        var chartResize = function() {
          // Emptying the chart divs
          var c1 = $("#chart1"),
            c2 = $("#chart2");
          c1.empty();
          c2.empty();

          // Sizing
          var ww = $(window).width(),
            cw = c1.parent().width();
          // Window width = 0 in printing mode
          if (ww == 0) {
            cw = 500;
          }
          c1.css("width", Math.min(d.length * 150, cw) + "px");
          c2.css("width", Math.min(d.length * 150, cw) + "px");

          var morrisArea = new Morris.Area({
            // ID of the element in which to draw the chart.
            element: "chart1",
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: d_prop,
            // The name of the data record attribute that contains x-values.
            xkey: "date",
            // A list of names of data record attributes that contain y-values.
            ykeys: ["match_rate_property"],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            xLabels: "day",
            ymin: 90,
            ymax: 100,
            smooth: false,
            hideHover: true,
            // Set to false to skip time/date parsing for X values, instead treating them as an equally-spaced series.
            parseTime: true,
            postUnits: "%",
            fillOpacity: 0.5,
            lineColors: ["green"],
            dateFormat: function(x) {
              var d = new Date(x);

              var yyyy = d.getFullYear().toString();
              var mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
              var dd = d.getDate().toString();

              return (
                yyyy +
                "-" +
                (mm[1] ? mm : "0" + mm[0]) +
                "-" +
                (dd[1] ? dd : "0" + dd[0])
              );
            },
            labels: ["Rate"]
          });

          var morrisArea = new Morris.Area({
            // ID of the element in which to draw the chart.
            element: "chart2",
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: d_addr,
            // The name of the data record attribute that contains x-values.
            xkey: "date",
            // A list of names of data record attributes that contain y-values.
            ykeys: ["match_rate_address"],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            xLabels: "day",
            ymin: 90,
            ymax: 100,
            smooth: false,
            hideHover: true,
            // Set to false to skip time/date parsing for X values, instead treating them as an equally-spaced series.
            parseTime: true,
            postUnits: "%",
            fillOpacity: 0.5,
            lineColors: ["green"],
            dateFormat: function(x) {
              var d = new Date(x);

              var yyyy = d.getFullYear().toString();
              var mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
              var dd = d.getDate().toString();

              return (
                yyyy +
                "-" +
                (mm[1] ? mm : "0" + mm[0]) +
                "-" +
                (dd[1] ? dd : "0" + dd[0])
              );
            },
            labels: ["Rate"]
          });
        };

        // Whenever browser window is resized
        $(window).resize(chartResize);

        // Initial execution
        chartResize();
      });
    } else {
      alert("File upload did not work. Please contact support.");
    }
  };

  if (QueryString["file"]) {
    processUploadResponse(
      '{"url":"../uploads/' +
        QueryString["file"] +
        '.json","lga_code":' +
        QueryString["file"].split("-")[0] +
        "}"
    );
  }
});
