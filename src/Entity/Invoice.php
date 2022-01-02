<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Component\Validator\Constraints\Type;
use App\Controller\InvoiceIncrementationController;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\Choice;
use Symfony\Component\Validator\Constraints\DateTime;
use Symfony\Component\Validator\Constraints\NotBlank;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource(
 *      subresourceOperations={
 *          "api_customers_invoices_get_subresource"={
 *              "normalization_context"={"groups"={"invoices_subresource"}}
 *           }
 *      },
 *      itemOperations={
 *          "get",
 *          "put",
 *          "delete",
 *          "increment" = {
 *              "method"="post",
 *              "path"="/invoices/{id}/increment",
 *              "controller"=InvoiceIncrementationController::class,
 *              "swagger_context"={
 *                  "summary"="Incrémente une facture",
 *                  "description"="Incrémente le chrono d'une facture donnée"
 *              }
 *          }
 *      },
 *      attributes={
 *          "pagination_enabled"= true, 
 *          "pagination_items_per_page" = 4,
 *          "order": {"amount":"desc"}
 *      },
 *      normalizationContext={
 *          "groups"={"invoice:read"}
 *      },
 *      denormalizationContext={
 *          "disable_type_enforcement"=true
 *      }
 * )
 * @ApiFilter(
 *      OrderFilter::class, 
 *      properties={"amount", "sentAt"}
 * )
 */
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoice:read", "customer:read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoice:read", "customer:read", "invoices_subresource"})
     * @NotBlank(message="le montant de la facture ne doit pas être vide")
     * @Type(type="numeric", message="l'amount doit être de type float")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoice:read", "customer:read"})
     * @DateTime(message="la date doit être au bon format")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoice:read", "customer:read"})
     * @NotBlank(message="le status de la facture est obligatoire")
     * @Choice(choices={"SENT", "PAID", "CANCELLED"}, message="les choix doivent
     *      être SENT, PAID, CANCELLED")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoice:read"})
     * @NotBlank(message="le customer doit être renseigné")
     * 
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoice:read"})
     * @NotBlank(message="Il faut que le chrono soit renseigné")
     */
    private $chrono;

    public function __construct()
    {

        $this->sentAt = new \DateTime(); 
    }

    /**
     * permet de récupérer le User du Customer correspondant
     * @Groups({"invoice:read"})
     */
    public function getUser(): User
    {
        return $this->customer->getUser();

    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
