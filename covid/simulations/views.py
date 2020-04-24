from django.shortcuts import render
from django.http import JsonResponse

import pandas as pd

df = pd.read_csv('/Users/kuand/Desktop/Projects/Covid/covid/applemobilitytrends-2020-04-13.csv')


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


def check_notifications(request):
    return render(request, 'main.html')

def covid_map(request):
    return render(request, 'map.html')
