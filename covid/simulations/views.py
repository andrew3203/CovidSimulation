from .models import Information

from django.shortcuts import render
from django.http import JsonResponse

import pandas as pd


url = "https://covid19-static.cdn-apple.com/covid19-mobility-data/2006HotfixDev17/v1/en-us/applemobilitytrends-2020-04-25.csv"
#url = os.environ.get('DATA_URL', url)
df = pd.read_csv('/Users/kuand/Desktop/Projects/Covid/activity.csv')


def get_all_regions(request):
    reg = df[df['transportation_type'] == 'walking']
    return JsonResponse(list(reg['region']), safe=False)


def get_hist_data(request):
    name = request.GET.get('search')
    locs = df.loc[(df['region'] == name)].index.values

    if len(locs) == 3:
        driving1 = df.loc[locs[0], '2020-01-13':]
        walking1 = df.loc[locs[2], '2020-01-13':]
    elif len(locs) == 2:
        driving1 = df.loc[locs[0], '2020-01-13':]
        walking1 = df.loc[locs[1], '2020-01-13':]
    else:
        driving1 = df.loc[locs[0], '2020-01-13':]
        walking1 = df.loc[locs[0], '2020-01-13':]

    driving = []
    walking = []
    for i in range(len(walking1)):
        driving.append({
            'date': driving1.index[i],
            'value': str(driving1[i]) + '%',
        })
        walking.append({
            'date': walking1.index[i],
            'value': str(walking1[i]) + '%',
        })

    data = {
        'name': name,
        'driving': driving,
        'walking': walking,
    }

    return JsonResponse(data, safe=False)


def get_page(request):
    obj = Information.objects.filter(id=2).first()

    data = {
        'error': 1,
    }
    if obj is not None:
        data['data'] = obj.get_data()
        data['error'] = 0

    return render(request, 'main.html', data)

def covid_map(request):
    return render(request, 'map.html')
