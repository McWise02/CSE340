INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

SELECT public.inventory.inv_make, public.inventory.inv_model, public.classification.classification_name FROM public.inventory
INNER JOIN public.classification ON public.inventory.classification_id = public.classification.classification_id
WHERE public.inventory.classification_id = 1;


UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';