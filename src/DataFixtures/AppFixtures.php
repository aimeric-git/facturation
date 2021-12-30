<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use Faker\Factory;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        ini_set ( 'memory_limit' , '-1' ) ;

        // $faker = Factory::create('fr_FR');
        $tabStatus = ['SENT', 'PAID', 'CANCELLED'];
        
        for($i=0; $i < 30; $i++)
        {
            $customer = new Customer();
            $customer->setFirstname('firstname '.$i);
            $customer->setLastname('lastname '.$i);
            $customer->setCompany('company '.$i);
            $customer->setEmail('email@test.com '.$i);

            $manager->persist($customer);

            for($i = 0; $i > mt_rand(3, 10); $i++)
            {
                $invoice = new Invoice();
                $invoice->setAmount(mt_rand(100, 200));
                $invoice->setStatus($tabStatus[mt_rand(0, 2)]);
                $invoice->setCustomer($customer);

                $manager->persist($invoice);
            }
        }

        // $product = new Product();
        // $manager->persist($product);

        $manager->flush();
    }
}
