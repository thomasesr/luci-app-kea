include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-kea
PKG_VERSION:=0.1.0
PKG_RELEASE:=1

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Thomas Richter <YOUR_EMAIL>

LUCI_TITLE:=LuCI support for Kea DHCP
LUCI_DEPENDS:=+luci-base +rpcd +rpcd-mod-ucode +kea-uci +kea-dhcp4 +kea-ctrl +kea-hook-lease-cmds
LUCI_PKGARCH:=all

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
