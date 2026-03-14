"""
Krishi ML Server - Flask Application
Serves all ML model predictions for the Smart Crop Advisory System
"""
import os
import json
import base64
import io
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# ─────────────────────────────────────────────────────────────────────────────
# Crop Recommendation Data & Model
# ─────────────────────────────────────────────────────────────────────────────
CROP_MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'crop_rf_model.pkl')
CROP_SCALER_PATH = os.path.join(os.path.dirname(__file__), 'models', 'crop_scaler.pkl')

crop_model = None
crop_scaler = None

CROPS = [
    'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
    'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate',
    'banana', 'mango', 'grapes', 'watermelon', 'muskmelon',
    'apple', 'orange', 'papaya', 'coconut', 'cotton',
    'jute', 'coffee', 'wheat', 'sugarcane'
]

CROP_INFO = {
    'rice': {'season': 'Kharif', 'water': 'High', 'icon': '🌾', 'hindiName': 'चावल', 'kannadaName': 'ಅಕ್ಕಿ', 'teluguName': 'వరి'},
    'maize': {'season': 'Kharif/Rabi', 'water': 'Medium', 'icon': '🌽', 'hindiName': 'मक्का', 'kannadaName': 'ಮೆಕ್ಕೆ ಜೋಳ', 'teluguName': 'మొక్కజొన్న'},
    'wheat': {'season': 'Rabi', 'water': 'Medium', 'icon': '🌾', 'hindiName': 'गेहूं', 'kannadaName': 'ಗೋಧಿ', 'teluguName': 'గోధుమ'},
    'cotton': {'season': 'Kharif', 'water': 'Medium', 'icon': '🏵️', 'hindiName': 'कपास', 'kannadaName': 'ಹತ್ತಿ', 'teluguName': 'పత్తి'},
    'sugarcane': {'season': 'Annual', 'water': 'Very High', 'icon': '🎋', 'hindiName': 'गन्ना', 'kannadaName': 'ಕಬ್ಬು', 'teluguName': 'చెరకు'},
    'banana': {'season': 'Annual', 'water': 'High', 'icon': '🍌', 'hindiName': 'केला', 'kannadaName': 'ಬಾಳೆ', 'teluguName': 'అరటి'},
    'mango': {'season': 'Summer', 'water': 'Low-Medium', 'icon': '🥭', 'hindiName': 'आम', 'kannadaName': 'ಮಾವು', 'teluguName': 'మామిడి'},
    'chickpea': {'season': 'Rabi', 'water': 'Low', 'icon': '🫘', 'hindiName': 'चना', 'kannadaName': 'ಕಡಲೆ', 'teluguName': 'శనగ'},
    'lentil': {'season': 'Rabi', 'water': 'Low', 'icon': '🫘', 'hindiName': 'दाल', 'kannadaName': 'ಬೇಳೆ', 'teluguName': 'పప్పు'},
    'coffee': {'season': 'Annual', 'water': 'Medium', 'icon': '☕', 'hindiName': 'कॉफी', 'kannadaName': 'ಕಾಫಿ', 'teluguName': 'కాఫీ'},
    'coconut': {'season': 'Annual', 'water': 'High', 'icon': '🥥', 'hindiName': 'नारियल', 'kannadaName': 'ತೆಂಗು', 'teluguName': 'కొబ్బరి'},
    'jute': {'season': 'Kharif', 'water': 'High', 'icon': '🌿', 'hindiName': 'जूट', 'kannadaName': 'ಜನಿವಾರ', 'teluguName': 'జనప'},
    'grapes': {'season': 'Annual', 'water': 'Medium', 'icon': '🍇', 'hindiName': 'अंगूर', 'kannadaName': 'ದ್ರಾಕ್ಷಿ', 'teluguName': 'ద్రాక్ష'},
    'orange': {'season': 'Winter', 'water': 'Medium', 'icon': '🍊', 'hindiName': 'संतरा', 'kannadaName': 'ಕಿತ್ತಳೆ', 'teluguName': 'నారంజ'},
    'watermelon': {'season': 'Summer', 'water': 'High', 'icon': '🍉', 'hindiName': 'तरबूज', 'kannadaName': 'ಕಲ್ಲಂಗಡಿ', 'teluguName': 'పుచ్చకాయ'},
    'mungbean': {'season': 'Kharif', 'water': 'Low', 'icon': '🫘', 'hindiName': 'मूंग', 'kannadaName': 'ಹೆಸರು', 'teluguName': 'పెసలు'},
    'blackgram': {'season': 'Kharif', 'water': 'Low', 'icon': '🫘', 'hindiName': 'उड़द', 'kannadaName': 'ಉದ್ದು', 'teluguName': 'మినుములు'},
    'kidneybeans': {'season': 'Kharif', 'water': 'Medium', 'icon': '🫘', 'hindiName': 'राजमा', 'kannadaName': 'ರಾಜ್ಮಾ', 'teluguName': 'రాజ్మా'},
    'pigeonpeas': {'season': 'Kharif', 'water': 'Low', 'icon': '🫘', 'hindiName': 'अरहर', 'kannadaName': 'ತೊಗರಿ', 'teluguName': 'కందులు'},
    'mothbeans': {'season': 'Kharif', 'water': 'Very Low', 'icon': '🫘', 'hindiName': 'मोठ', 'kannadaName': 'ಮಠ ಕಾಳು', 'teluguName': 'మఠ'},
    'pomegranate': {'season': 'Annual', 'water': 'Low', 'icon': '🍎', 'hindiName': 'अनार', 'kannadaName': 'ದಾಳಿಂಬೆ', 'teluguName': 'దానిమ్మ'},
    'muskmelon': {'season': 'Summer', 'water': 'Medium', 'icon': '🍈', 'hindiName': 'खरबूज', 'kannadaName': 'ಕರ್ಬೂಜ', 'teluguName': 'ఖర్బూజ'},
    'apple': {'season': 'Annual', 'water': 'Medium', 'icon': '🍎', 'hindiName': 'सेब', 'kannadaName': 'ಸೇಬು', 'teluguName': 'యాపిల్'},
    'papaya': {'season': 'Annual', 'water': 'High', 'icon': '🍈', 'hindiName': 'पपीता', 'kannadaName': 'ಪಪ್ಪಾಯಿ', 'teluguName': 'బొప్పాయి'},
}


def train_crop_model():
    """Train a Random Forest model on synthetic crop recommendation data"""
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.preprocessing import StandardScaler
    import random

    random.seed(42)
    np.random.seed(42)

    # Typical parameter ranges per crop (N, P, K, temperature, humidity, pH, rainfall)
    crop_params = {
        'rice':        ([60,100], [30,60], [30,60], [20,27], [80,90], [5.5,7.0], [150,300]),
        'maize':       ([60,100], [50,80], [50,80], [18,27], [65,75], [5.5,7.5], [50,100]),
        'wheat':       ([80,120], [40,60], [40,60], [10,20], [50,65], [6.0,7.5], [50,100]),
        'sugarcane':   ([20,40], [10,20], [20,50], [24,30], [65,80], [6.0,7.5], [150,250]),
        'cotton':      ([100,140], [50,80], [40,60], [24,30], [60,75], [5.8,7.0], [60,110]),
        'chickpea':    ([20,40], [50,70], [60,90], [18,25], [15,30], [5.5,7.0], [40,70]),
        'lentil':      ([10,20], [25,35], [20,30], [15,20], [65,75], [6.0,8.0], [35,60]),
        'banana':      ([80,120], [50,80], [100,130], [25,35], [75,90], [5.5,7.0], [100,250]),
        'mango':       ([10,20], [10,20], [10,20], [23,32], [50,70], [5.2,7.5], [90,180]),
        'coffee':      ([80,120], [20,40], [20,40], [20,30], [65,80], [5.5,7.0], [100,250]),
        'coconut':     ([20,40], [10,30], [50,80], [25,35], [70,85], [5.0,7.5], [100,250]),
        'jute':        ([60,80], [40,60], [40,60], [24,35], [70,90], [6.0,7.5], [150,300]),
        'grapes':      ([20,40], [50,80], [60,100], [15,25], [55,75], [5.5,6.5], [50,80]),
        'orange':      ([10,20], [5,15], [5,15], [20,30], [60,80], [6.0,7.5], [100,150]),
        'watermelon':  ([80,120], [10,20], [50,80], [25,35], [75,90], [5.5,7.0], [40,60]),
        'mungbean':    ([20,40], [30,60], [20,40], [25,35], [80,90], [6.2,7.2], [40,80]),
        'blackgram':   ([20,40], [50,80], [30,50], [25,35], [64,72], [5.5,7.0], [60,100]),
        'kidneybeans': ([20,40], [50,80], [20,40], [15,25], [18,26], [5.5,7.0], [60,90]),
        'pigeonpeas':  ([20,40], [50,80], [20,40], [25,35], [48,60], [5.0,8.0], [60,170]),
        'mothbeans':   ([20,40], [30,60], [10,30], [28,38], [48,62], [3.5,6.5], [20,60]),
        'pomegranate': ([10,20], [10,20], [40,60], [18,28], [85,95], [5.5,7.5], [200,400]),
        'muskmelon':   ([80,120], [10,20], [50,80], [25,35], [90,95], [6.0,7.0], [20,40]),
        'apple':       ([0,20], [100,130], [180,220], [20,30], [92,95], [5.5,6.5], [100,200]),
        'papaya':      ([40,60], [20,40], [40,60], [25,38], [80,95], [6.0,7.0], [100,200]),
    }

    X, y = [], []
    for crop, (n_r, p_r, k_r, t_r, h_r, ph_r, rain_r) in crop_params.items():
        for _ in range(200):
            X.append([
                random.uniform(*n_r),
                random.uniform(*p_r),
                random.uniform(*k_r),
                random.uniform(*t_r),
                random.uniform(*h_r),
                random.uniform(*ph_r),
                random.uniform(*rain_r),
            ])
            y.append(crop)

    X = np.array(X)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_scaled, y)

    os.makedirs(os.path.join(os.path.dirname(__file__), 'models'), exist_ok=True)
    joblib.dump(model, CROP_MODEL_PATH)
    joblib.dump(scaler, CROP_SCALER_PATH)
    return model, scaler


def load_crop_model():
    global crop_model, crop_scaler
    if os.path.exists(CROP_MODEL_PATH) and os.path.exists(CROP_SCALER_PATH):
        crop_model = joblib.load(CROP_MODEL_PATH)
        crop_scaler = joblib.load(CROP_SCALER_PATH)
    else:
        crop_model, crop_scaler = train_crop_model()


# ─────────────────────────────────────────────────────────────────────────────
# Fertilizer Advisory
# ─────────────────────────────────────────────────────────────────────────────
FERTILIZER_DB = {
    'rice':       {'N': 120, 'P': 60, 'K': 60},
    'wheat':      {'N': 120, 'P': 60, 'K': 40},
    'maize':      {'N': 150, 'P': 75, 'K': 75},
    'sugarcane':  {'N': 250, 'P': 85, 'K': 115},
    'cotton':     {'N': 120, 'P': 60, 'K': 60},
    'banana':     {'N': 200, 'P': 60, 'K': 200},
    'mango':      {'N': 100, 'P': 50, 'K': 100},
    'chickpea':   {'N': 40, 'P': 80, 'K': 40},
    'lentil':     {'N': 30, 'P': 60, 'K': 40},
    'coffee':     {'N': 100, 'P': 50, 'K': 100},
    'default':    {'N': 80, 'P': 40, 'K': 40},
}

FERTILIZER_TYPES = {
    'N': {'main': 'Urea (46% N)', 'organic': 'Farmyard Manure', 'kg_per_unit': 2.17},
    'P': {'main': 'DAP (18% N, 46% P)', 'organic': 'Single Super Phosphate', 'kg_per_unit': 2.17},
    'K': {'main': 'MOP (Muriate of Potash 60% K)', 'organic': 'Wood Ash', 'kg_per_unit': 1.67},
}

def get_fertilizer_advice(crop, soil_n, soil_p, soil_k, area_hectares=1.0):
    """Rule-based fertilizer recommendation"""
    target = FERTILIZER_DB.get(crop.lower(), FERTILIZER_DB['default'])
    advice = []
    warnings = []

    for nutrient in ['N', 'P', 'K']:
        soil_val = {'N': soil_n, 'P': soil_p, 'K': soil_k}[nutrient]
        deficit = max(0, target[nutrient] - soil_val)
        ftype = FERTILIZER_TYPES[nutrient]

        if deficit > 0:
            app_kg = round(deficit * area_hectares * ftype['kg_per_unit'], 1)
            advice.append({
                'nutrient': nutrient,
                'deficit': deficit,
                'fertilizer': ftype['main'],
                'organicAlternative': ftype['organic'],
                'applicationKg': app_kg,
                'timing': 'At sowing / Basal application' if nutrient == 'P' else 'Split in 2-3 doses',
            })
        else:
            warnings.append(f'{nutrient}: Adequate or excess – skip or reduce application')

    return {
        'crop': crop,
        'recommendations': advice,
        'warnings': warnings,
        'irrigationTip': get_irrigation_tip(crop),
        'notes': 'Always conduct soil test before heavy fertilizer application.'
    }


def get_irrigation_tip(crop):
    tips = {
        'rice': 'Maintain 2–5 cm standing water during vegetative stage. Drain 2 weeks before harvest.',
        'wheat': 'Irrigate at CRI, tillering, jointing, flowering, and grain filling stages (5–6 irrigations).',
        'maize': 'Critical stages: knee-high, tasseling, silking. Avoid waterlogging.',
        'sugarcane': 'Heavy feeder; irrigate every 7–10 days in summer. Total ~1500–2500 mm/season.',
        'cotton': 'Furrow irrigation; critical at squaring and boll development. Avoid drought stress.',
        'banana': 'Daily drip irrigation preferred. 8–10 liters/plant/day.',
        'mango': 'Irrigate at fruit set and fruit development. Withhold water 2 months before flowering.',
        'default': 'Monitor soil moisture regularly. Use drip irrigation to conserve water.',
    }
    return tips.get(crop.lower(), tips['default'])


# ─────────────────────────────────────────────────────────────────────────────
# Disease Detection (Rule-based on color analysis + pre-defined disease set)
# ─────────────────────────────────────────────────────────────────────────────
DISEASES = [
    {
        'name': 'Late Blight',
        'crops': ['Tomato', 'Potato'],
        'symptoms': 'Dark brown water-soaked lesions on leaves, white mold on underside',
        'treatment': 'Apply Mancozeb 75 WP @ 2g/L or Metalaxyl. Remove infected parts. Avoid overhead irrigation.',
        'severity': 'High',
        'icon': '🍅',
    },
    {
        'name': 'Leaf Rust',
        'crops': ['Wheat', 'Barley'],
        'symptoms': 'Orange-brown pustules on leaf surface, yellow halo around pustules',
        'treatment': 'Apply Propiconazole 25 EC @ 0.1% or Tebuconazole. Early morning spraying preferred.',
        'severity': 'Medium',
        'icon': '🌾',
    },
    {
        'name': 'Powdery Mildew',
        'crops': ['Grapes', 'Cucumber', 'Wheat'],
        'symptoms': 'White powdery coating on leaves and stems, leaves curl and dry',
        'treatment': 'Spray Sulfur 80 WP @ 2g/L or Carbendazim 50 WP @ 1g/L. Improve air circulation.',
        'severity': 'Medium',
        'icon': '🍇',
    },
    {
        'name': 'Bacterial Leaf Blight',
        'crops': ['Rice'],
        'symptoms': 'Water-soaked pale green lesions on leaf margins turning yellow to white',
        'treatment': 'Apply Copper Oxychloride 50 WP @ 3g/L. Use resistant varieties. Avoid flood irrigation.',
        'severity': 'High',
        'icon': '🌾',
    },
    {
        'name': 'Anthracnose',
        'crops': ['Mango', 'Beans', 'Chilli'],
        'symptoms': 'Dark sunken lesions on fruits and leaves, pink spore masses in humid conditions',
        'treatment': 'Apply Carbendazim 50 WP @ 1g/L at fruiting stage. Prune infected branches.',
        'severity': 'Medium',
        'icon': '🥭',
    },
    {
        'name': 'Fusarium Wilt',
        'crops': ['Banana', 'Cotton', 'Tomato'],
        'symptoms': 'Yellowing of lower leaves, vascular browning, wilting of whole plant',
        'treatment': 'Drench soil with Carbendazim. Use Trichoderma viride as bio-control. Remove infected plants.',
        'severity': 'High',
        'icon': '🍌',
    },
    {
        'name': 'Downy Mildew',
        'crops': ['Grapes', 'Cucumber', 'Onion'],
        'symptoms': 'Yellow patches on upper leaf surface, purplish mold on underside',
        'treatment': 'Apply Metalaxyl + Mancozeb @ 2.5g/L. Spray in cool, early morning hours.',
        'severity': 'Medium',
        'icon': '🧅',
    },
    {
        'name': 'Brown Spot',
        'crops': ['Rice'],
        'symptoms': 'Oval brown spots with yellow halo on leaves, seedling blight',
        'treatment': 'Seed treatment with Thiram. Foliar spray with Mancozeb 75 WP @ 2g/L.',
        'severity': 'Medium',
        'icon': '🌾',
    },
    {
        'name': 'Yellow Mosaic Virus',
        'crops': ['Moong', 'Soybean', 'Bhindi'],
        'symptoms': 'Yellow-green mosaic pattern on leaves, stunted growth, malformed pods',
        'treatment': 'No cure once infected. Control whitefly vector with Imidacloprid. Remove diseased plants.',
        'severity': 'High',
        'icon': '🫘',
    },
    {
        'name': 'Cercospora Leaf Spot',
        'crops': ['Sugarcane', 'Groundnut', 'Beet'],
        'symptoms': 'Small circular brown spots with grey center, may coalesce forming blights',
        'treatment': 'Spray Propiconazole 25 EC @ 0.1% or Copper Fungicide. Avoid dense planting.',
        'severity': 'Low',
        'icon': '🎋',
    },
]


def analyze_image_disease(image_bytes):
    """
    Analyze image using color histograms and statistical features
    to simulate disease detection. Returns top diseases with confidence scores.
    """
    try:
        from PIL import Image

        img = Image.open(io.BytesIO(image_bytes)).convert('RGB').resize((224, 224))
        arr = np.array(img, dtype=np.float32)

        # Extract color features
        r_mean = arr[:, :, 0].mean()
        g_mean = arr[:, :, 1].mean()
        b_mean = arr[:, :, 2].mean()
        r_std = arr[:, :, 0].std()

        brown_mask = (arr[:, :, 0] > 100) & (arr[:, :, 1] < 80) & (arr[:, :, 2] < 60)
        yellow_mask = (arr[:, :, 0] > 150) & (arr[:, :, 1] > 130) & (arr[:, :, 2] < 80)
        white_mask = (arr[:, :, 0] > 200) & (arr[:, :, 1] > 200) & (arr[:, :, 2] > 200)
        dark_mask = (arr[:, :, 0] < 50) & (arr[:, :, 1] < 50) & (arr[:, :, 2] < 50)

        brown_ratio = brown_mask.mean()
        yellow_ratio = yellow_mask.mean()
        white_ratio = white_mask.mean()
        dark_ratio = dark_mask.mean()
        green_ratio = (arr[:, :, 1] > 100).mean()

        # Disease scoring based on visual features
        scores = {}
        scores['Late Blight'] = brown_ratio * 0.5 + dark_ratio * 0.3 + (1 - green_ratio) * 0.2
        scores['Leaf Rust'] = brown_ratio * 0.4 + (r_mean / 255) * 0.3 + r_std / 255 * 0.3
        scores['Powdery Mildew'] = white_ratio * 0.7 + (1 - green_ratio) * 0.3
        scores['Bacterial Leaf Blight'] = yellow_ratio * 0.5 + (1 - green_ratio) * 0.3 + white_ratio * 0.2
        scores['Anthracnose'] = dark_ratio * 0.5 + brown_ratio * 0.3 + (1 - green_ratio) * 0.2
        scores['Fusarium Wilt'] = yellow_ratio * 0.6 + brown_ratio * 0.2 + (1 - green_ratio) * 0.2
        scores['Downy Mildew'] = (b_mean / 255) * 0.3 + yellow_ratio * 0.4 + white_ratio * 0.3
        scores['Brown Spot'] = brown_ratio * 0.6 + dark_ratio * 0.2 + r_std / 255 * 0.2
        scores['Yellow Mosaic Virus'] = yellow_ratio * 0.7 + (g_mean / 255) * 0.3
        scores['Cercospora Leaf Spot'] = brown_ratio * 0.4 + grey_score(arr) * 0.4 + dark_ratio * 0.2

        # Add noise for realism
        for k in scores:
            scores[k] = min(1.0, scores[k] + np.random.uniform(0.05, 0.15))

        # Normalize to sum = 1
        total = sum(scores.values()) or 1
        scores = {k: v / total for k, v in scores.items()}

        # Pick top disease
        top_disease_name = max(scores, key=scores.get)
        confidence = round(float(scores[top_disease_name]) * 100, 1)

        disease_info = next((d for d in DISEASES if d['name'] == top_disease_name), DISEASES[0])
        alternatives = sorted(
            [(k, v) for k, v in scores.items() if k != top_disease_name],
            key=lambda x: x[1], reverse=True
        )[:2]

        return {
            'detected': True,
            'disease': {
                **disease_info,
                'confidence': float(confidence),
            },
            'alternatives': [
                {'name': n, 'confidence': round(float(v) * 100, 1)}
                for n, v in alternatives
            ],
            'isHealthy': bool(green_ratio > 0.6 and brown_ratio < 0.05 and yellow_ratio < 0.05),
        }

    except Exception as e:
        return {'detected': False, 'error': str(e), 'disease': DISEASES[0]}


def grey_score(arr):
    diff_rg = np.abs(arr[:, :, 0].astype(float) - arr[:, :, 1].astype(float))
    diff_rb = np.abs(arr[:, :, 0].astype(float) - arr[:, :, 2].astype(float))
    grey_mask = (diff_rg < 30) & (diff_rb < 30) & (arr[:, :, 0] > 60) & (arr[:, :, 0] < 180)
    return grey_mask.mean()


# ─────────────────────────────────────────────────────────────────────────────
# Market Price Prediction (ARIMA simulation)
# ─────────────────────────────────────────────────────────────────────────────
BASE_PRICES = {
    'rice': 2100, 'wheat': 2200, 'maize': 1800, 'sugarcane': 350,
    'cotton': 6200, 'banana': 1800, 'mango': 4500, 'chickpea': 5500,
    'lentil': 6000, 'coffee': 8500, 'coconut': 3200, 'grapes': 4000,
    'soybean': 4500, 'mustard': 5200, 'groundnut': 5800, 'potato': 1200,
    'tomato': 2000, 'onion': 1800, 'default': 3000,
}

SEASONAL_FACTORS = {
    1: 1.05, 2: 1.08, 3: 1.05, 4: 0.97, 5: 0.93, 6: 0.92,
    7: 0.95, 8: 0.98, 9: 1.00, 10: 1.02, 11: 1.07, 12: 1.10,
}


def generate_price_forecast(crop, district, months=6):
    """Generate realistic price forecast using ARIMA-like simulation"""
    try:
        from statsmodels.tsa.arima.model import ARIMA

        base = BASE_PRICES.get(crop.lower(), BASE_PRICES['default'])
        np.random.seed(hash(crop + district) % 1000)

        # Generate historical prices (last 36 months)
        current_month = 3  # March
        hist_prices = []
        for i in range(36):
            month = ((current_month - 36 + i) % 12) + 1
            seasonal = SEASONAL_FACTORS[month]
            noise = np.random.normal(0, base * 0.03)
            trend = base * (1 + i * 0.002)
            hist_prices.append(trend * seasonal + noise)

        model = ARIMA(hist_prices, order=(2, 1, 2))
        fitted = model.fit()
        forecast = fitted.forecast(steps=months)

        labels = []
        month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        for i in range(months):
            m = (current_month + i) % 12
            labels.append(month_names[m])

        return {
            'crop': crop,
            'district': district,
            'currency': 'INR/Quintal',
            'currentPrice': round(hist_prices[-1], 0),
            'forecastPrices': [round(float(p), 0) for p in forecast],
            'forecastLabels': labels,
            'trend': 'Rising' if forecast[-1] > hist_prices[-1] else 'Falling',
            'trendPercent': round((float(forecast[-1]) - hist_prices[-1]) / hist_prices[-1] * 100, 1),
            'msp': round(base * 0.85, 0),
            'advice': get_price_advice(float(forecast[-1]), base),
        }
    except Exception as e:
        # Fallback without ARIMA
        return generate_price_forecast_simple(crop, district, months)


def generate_price_forecast_simple(crop, district, months=6):
    base = BASE_PRICES.get(crop.lower(), BASE_PRICES['default'])
    np.random.seed(hash(crop + district) % 1000)
    current_month = 3
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    labels, prices = [], []
    for i in range(months):
        m = (current_month + i) % 12
        labels.append(month_names[m])
        seasonal = SEASONAL_FACTORS[m + 1]
        trend = base * (1 + i * 0.008)
        noise = np.random.normal(0, base * 0.025)
        prices.append(round(trend * seasonal + noise, 0))

    return {
        'crop': crop, 'district': district, 'currency': 'INR/Quintal',
        'currentPrice': round(base * SEASONAL_FACTORS[current_month], 0),
        'forecastPrices': prices, 'forecastLabels': labels,
        'trend': 'Rising' if prices[-1] > prices[0] else 'Falling',
        'trendPercent': round((prices[-1] - prices[0]) / prices[0] * 100, 1),
        'msp': round(base * 0.85, 0),
        'advice': get_price_advice(prices[-1], base),
    }


def get_price_advice(forecast_price, base_price):
    ratio = forecast_price / base_price
    if ratio > 1.15:
        return '📈 Prices expected to rise significantly. Consider selling after 1–2 months for higher returns.'
    elif ratio > 1.05:
        return '📊 Moderate price increase expected. Good time to plan storage and phased selling.'
    elif ratio < 0.90:
        return '📉 Prices may fall. Consider selling now or explore cold-storage options.'
    else:
        return '➡️ Prices expected to remain stable. Sell based on your cash-flow needs.'


# ─────────────────────────────────────────────────────────────────────────────
# Flask Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'Krishi ML Server'})


@app.route('/predict/crop', methods=['POST'])
def predict_crop():
    try:
        data = request.json
        N = float(data.get('N', 90))
        P = float(data.get('P', 42))
        K = float(data.get('K', 43))
        temperature = float(data.get('temperature', 25))
        humidity = float(data.get('humidity', 70))
        pH = float(data.get('pH', 6.5))
        rainfall = float(data.get('rainfall', 200))

        features = np.array([[N, P, K, temperature, humidity, pH, rainfall]])
        features_scaled = crop_scaler.transform(features)
        probs = crop_model.predict_proba(features_scaled)[0]
        classes = crop_model.classes_

        top_indices = np.argsort(probs)[::-1][:5]
        recommendations = []
        for idx in top_indices:
            crop_name = classes[idx]
            info = CROP_INFO.get(crop_name, {})
            recommendations.append({
                'crop': crop_name,
                'confidence': round(float(probs[idx]) * 100, 1),
                'icon': info.get('icon', '🌱'),
                'season': info.get('season', 'Year-round'),
                'waterRequirement': info.get('water', 'Medium'),
                'hindiName': info.get('hindiName', crop_name),
                'kannadaName': info.get('kannadaName', crop_name),
                'teluguName': info.get('teluguName', crop_name),
            })

        return jsonify({'success': True, 'recommendations': recommendations, 'inputParams': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/predict/fertilizer', methods=['POST'])
def predict_fertilizer():
    try:
        data = request.json
        result = get_fertilizer_advice(
            crop=data.get('crop', 'rice'),
            soil_n=float(data.get('N', 40)),
            soil_p=float(data.get('P', 20)),
            soil_k=float(data.get('K', 20)),
            area_hectares=float(data.get('area', 1.0)),
        )
        return jsonify({'success': True, **result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/predict/disease', methods=['POST'])
def predict_disease():
    try:
        if 'image' in request.files:
            image_bytes = request.files['image'].read()
        elif request.json and 'imageBase64' in request.json:
            img_data = request.json['imageBase64']
            if ',' in img_data:
                img_data = img_data.split(',')[1]
            image_bytes = base64.b64decode(img_data)
        else:
            return jsonify({'success': False, 'error': 'No image provided'}), 400

        result = analyze_image_disease(image_bytes)
        return jsonify({'success': True, **result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/predict/price', methods=['POST'])
def predict_price():
    try:
        data = request.json
        crop = data.get('crop', 'rice')
        district = data.get('district', 'Bangalore')
        months = int(data.get('months', 6))
        result = generate_price_forecast(crop, district, months)
        return jsonify({'success': True, **result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/diseases/list', methods=['GET'])
def list_diseases():
    return jsonify({'diseases': DISEASES})


# Load models at module level so Gunicorn loads them when starting
print('Training/Loading crop recommendation model...')
load_crop_model()
print('ML models ready!')

if __name__ == '__main__':
    print('Starting Krishi ML Server on Localhost...')
    app.run(host='0.0.0.0', port=5001, debug=False)
