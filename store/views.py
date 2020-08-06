from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from django.core import serializers
import json, datetime
# Create your views here.

def store(request):
    products = Product.objects.all()
    context = { 'products': products }
    return render(request, 'store/store.html', context)

def cart(request):

    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
    else:
        items = []

    context = {'items': items, 'order':order}
    return render(request, 'store/cart.html', context)

def checkout(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
    else:
        items = []

    context = {'items': items, 'order':order}
    return render(request, 'store/checkout.html', context)

def updateCart(request):
    productId = request.POST['productId']
    action = request.POST['action']
    customer = request.user.customer
    product = Product(id = productId)
    order, created = Order.objects.get_or_create(customer=customer, complete=False)
    orderItem, created = OrderItem.objects.get_or_create(product=product, order=order)
    
    if action == 'add':
        orderItem.quantity = (orderItem.quantity + 1)
    if action == 'remove':
        orderItem.quantity = (orderItem.quantity - 1)
    orderItem.save()

    if orderItem.quantity <= 0:
        orderItem.delete()
    return JsonResponse('It is okay', safe = False)

def getCartItems(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        orderitems = order.orderitem_set.all()
    else:
        orderitems = []
    total = sum([item.quantity for item in orderitems])
   
    cartObj = {'totalItems': total}
    items = {}
    for item in orderitems:
        items[item.product.id] = item.quantity

    cartObj['items']=items
    cartObj['total_cart']=order.get_cart_total

    return JsonResponse(cartObj, safe = False)


def processOrder(request):
    transaction_id = datetime.datetime.now().timestamp
    return JsonResponse('Completed order')